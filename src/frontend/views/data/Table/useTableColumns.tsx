import { msg } from "@lingui/macro";
import type { ReactNode } from "react";

import { ActionButtons } from "@/components/app/button/action";
import type { ITableColumn } from "@/components/app/table/types";
import {
  useAppConfiguration,
  useEntityConfiguration,
} from "@/frontend/hooks/configuration/configuration.store";
import { ENTITY_LIST_PATH } from "@/frontend/hooks/data/constants";
import {
  useEntityCrudFields,
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
} from "@/frontend/hooks/entity/entity.config";
import {
  useEntityIdField,
  useEntityToOneReferenceFields,
} from "@/frontend/hooks/entity/entity.store";
import { useEvaluateScriptContext } from "@/frontend/hooks/scripts";
import type { DataStateKeys } from "@/frontend/lib/data/types";
import { ellipsis } from "@/shared/lib/strings";
import type { TableFilterType } from "@/shared/types/data";
import type { IColorableSelection } from "@/shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "@/shared/validations";
import type { FormFieldTypes } from "@/shared/validations/types";

import { usePortalActionButtons } from "../Details/portal";
import { evalutePresentationScript } from "../evaluatePresentationScript";
import { useEntityActionButtons } from "../hooks/useEntityActionButtons";
import { viewSpecialDataTypes } from "../viewSpecialDataTypes";
import { PortalColumnRender, usePortalTableColumns } from "./portal";

export const ACTIONS_ACCESSOR = "__actions__";

function TableActionButtons({
  row,
  entity,
}: {
  entity: string;
  row: {
    original: Record<string, unknown>;
  };
}) {
  const idField = useEntityIdField(entity);

  const idValue = row.original[idField.data || "id"] as string;

  const actionButtons = useEntityActionButtons({
    entity,
    entityId: idValue,
  });

  const portalActionButtons = usePortalActionButtons({
    entity,
    entityId: idValue,
    baseActionButtons: actionButtons,
    from: "table-inline",
    row: row.original,
  });

  return <ActionButtons actionButtons={portalActionButtons} size="icon" />;
}

const buildFilterConfigFromType = (prop: {
  entityType: FormFieldTypes;
  entityFieldSelections: IColorableSelection[];
  isIdField: boolean;
  referenceField?: string;
}): TableFilterType | undefined => {
  const { entityType, entityFieldSelections, isIdField, referenceField } = prop;

  if (isIdField) {
    return {
      _type: "idField",
      bag: undefined,
    };
  }
  const filterType$1 =
    FIELD_TYPES_CONFIG_MAP[entityType]?.tableFilterType || "not-filterable";

  if (filterType$1 === "not-filterable") {
    return undefined;
  }

  const filterType: TableFilterType = JSON.parse(JSON.stringify(filterType$1));

  switch (filterType._type) {
    case "date":
    case "string":
    case "number":
    case "idField":
      return filterType;
    case "boolean":
    case "status":
      filterType.bag = entityFieldSelections;
      return filterType;
    case "list":
      if (!referenceField) {
        return undefined;
      }
      filterType.bag = ENTITY_LIST_PATH(referenceField);
      return filterType;
  }
};

export const useTableColumns = (
  entity: string
): Partial<DataStateKeys<ITableColumn[]>> => {
  const portalTableColumns = usePortalTableColumns(entity);
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const entityCrudFields = useEntityCrudFields(entity, "table");
  const defaultDateFormat = useAppConfiguration("default_date_format");
  const evaluateScriptContext = useEvaluateScriptContext();
  const entityPresentationScript = useEntityConfiguration(
    "entity_presentation_script",
    entity
  );

  const idField = useEntityIdField(entity);

  const entityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const actionButtons = useEntityActionButtons({
    entity,
    entityId: "doesnt-matter-any-value-will-do-here",
  });

  if (
    entityToOneReferenceFields.isLoading ||
    defaultDateFormat.isLoading ||
    entityCrudFields.isLoading ||
    idField.isLoading
  ) {
    return {
      isLoading: true,
    };
  }

  const error =
    entityToOneReferenceFields.error ||
    defaultDateFormat.error ||
    entityCrudFields.error ||
    idField.error;

  if (error) {
    return {
      error,
    };
  }

  const columns: ITableColumn[] = entityCrudFields.data.map(
    ({ name, isId }) => {
      const tableColumn: ITableColumn = {
        Header: msg`${getEntityFieldLabels(name)}`,
        accessor: name,
        filter: buildFilterConfigFromType({
          entityType: entityFieldTypes[name],
          entityFieldSelections: entityFieldSelections[name],
          isIdField: idField.data === name,
          referenceField: entityToOneReferenceFields.data[name],
        }),
        disableSortBy:
          !FIELD_TYPES_CONFIG_MAP[entityFieldTypes[name]]?.sortable,
        Cell: ({ row }: { row: { original: Record<string, unknown> } }) => {
          const value$1 = row.original[name];
          if (isId) {
            return <span>{value$1 as string}</span>;
          }

          const value = evalutePresentationScript(
            entityPresentationScript.data.script,
            {
              field: name,
              from: "table",
              row: row.original,
              value: value$1,
              ...evaluateScriptContext,
            }
          );

          const specialDataTypeRender = viewSpecialDataTypes({
            fieldName: name,
            value,
            entityToOneReferenceFields: entityToOneReferenceFields.data,
            entityFieldSelections,
            entityFieldTypes,
            options: {
              displayFrom: "table",
              defaultDateFormat: defaultDateFormat.data,
            },
          });

          let cellRender: string | ReactNode = value;

          if (typeof value === "string") {
            cellRender = ellipsis(value as string, 50);
          }

          if (specialDataTypeRender) {
            cellRender = specialDataTypeRender;
          }

          return (
            <PortalColumnRender
              {...{
                column: name,
                value: value$1,
                entity,
                entityId: row.original[idField.data] as string,
              }}
            >
              {cellRender}
            </PortalColumnRender>
          );
        },
      };
      return tableColumn;
    }
  );

  if (actionButtons.length > 0) {
    columns.push({
      Header: msg`Actions`,
      accessor: ACTIONS_ACCESSOR,
      disableSortBy: true,
      Cell: ({ row }: { row: { original: Record<string, unknown> } }) => (
        <TableActionButtons row={row} entity={entity} />
      ),
    });
  }

  return { data: portalTableColumns(columns) };
};
