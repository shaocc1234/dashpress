import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useEntityCrudConfig } from "frontend/hooks/entity/entity.config";
import { TableSkeleton } from "frontend/design-system/components/Skeleton/Table";
import { ENTITY_TABLE_PATH } from "frontend/hooks/data/constants";
import { useTableColumns } from "../useTableColumns";
import { TableViewComponent } from "../portal";
import { IDataTableProps } from "../types";
import { BaseDataTable } from "../DataTable";

interface IProps extends IDataTableProps {
  entity: string;
  tabKey?: string;
}

export function EntityDataTable({ entity, tabKey = "", ...props }: IProps) {
  const columns = useTableColumns(entity);

  const entityCrudConfig = useEntityCrudConfig(entity);

  const { error } = columns;

  const { isLoading } = columns;

  return (
    <>
      <ViewStateMachine
        error={error}
        loading={isLoading}
        loader={<TableSkeleton />}
      >
        {!isLoading && (
          <BaseDataTable
            dataEndpoint={ENTITY_TABLE_PATH(entity)}
            columns={columns.data || []}
            stateStorageKey={`${entity}${tabKey}`}
            crudConfig={entityCrudConfig}
            {...props}
          />
        )}
      </ViewStateMachine>
      <TableViewComponent entity={entity} />
    </>
  );
}
