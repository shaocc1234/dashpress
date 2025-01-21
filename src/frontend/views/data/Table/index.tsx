import { AppLayout } from "@/frontend/_layouts/app";
import {
  useEntityCrudConfig,
  useEntitySlug,
} from "@/frontend/hooks/entity/entity.config";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import { META_USER_PERMISSIONS } from "@/shared/constants/user";
import { GranularEntityPermissions } from "@/shared/types/user";

import { useEntityActionMenuItems } from "../../entity/constants";
import { WholeEntityTable } from "./_WholeEntityTable";
import { getEntityCreateLink, useTableMenuItems } from "./useTableMenuItems";

export function EntityTable() {
  const entity = useEntitySlug();
  const entityCrudConfig = useEntityCrudConfig(entity);

  const actionItems = useEntityActionMenuItems(entity);

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.TITLE,
    viewKey: "ENTITY_TABLE",
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
      entity,
      GranularEntityPermissions.Show
    ),
  });

  const menuItems = useTableMenuItems(entity);

  return (
    <AppLayout actionItems={menuItems} secondaryActionItems={actionItems}>
      <WholeEntityTable
        entity={entity}
        createNewLink={getEntityCreateLink(entity)}
      />
    </AppLayout>
  );
}
