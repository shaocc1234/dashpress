import { configurationApiService } from "@/backend/configuration/configuration.service";
import {
  ForbiddenError,
  NotFoundError,
  progammingError,
} from "@/backend/lib/errors";
import { rolesApiService } from "@/backend/roles/roles.service";
import type {
  DataActionType,
  IEntityCrudSettings,
} from "@/shared/configurations";
import { META_USER_PERMISSIONS } from "@/shared/constants/user";
import { GranularEntityPermissions } from "@/shared/types/user";

import { ERROR_MESSAGE, getEntityFromRequest } from "./entity";
import type { ValidationImplType } from "./types";

const EntityCrudCheck: Record<
  DataActionType,
  {
    entityCrudField?: keyof IEntityCrudSettings;
    granularPermission: GranularEntityPermissions;
  }
> = {
  create: {
    entityCrudField: "create",
    granularPermission: GranularEntityPermissions.Create,
  },
  details: {
    entityCrudField: "details",
    granularPermission: GranularEntityPermissions.Show,
  },
  update: {
    entityCrudField: "update",
    granularPermission: GranularEntityPermissions.Update,
  },
  delete: {
    entityCrudField: "delete",
    granularPermission: GranularEntityPermissions.Delete,
  },
  list: {
    entityCrudField: undefined,
    granularPermission: GranularEntityPermissions.Show,
  },
  table: {
    entityCrudField: undefined,
    granularPermission: GranularEntityPermissions.Show,
  },
  count: {
    entityCrudField: undefined,
    granularPermission: GranularEntityPermissions.Show,
  },
  reference: {
    entityCrudField: undefined,
    granularPermission: GranularEntityPermissions.Show,
  },
};

export const crudEnabledValidationImpl: ValidationImplType<void> = async (
  req,
  action: unknown
) => {
  progammingError("Please provide the action for the CRUD check", !action);

  progammingError(
    "Invalid action for crud-enabled check",
    !EntityCrudCheck[action as DataActionType]
  );

  const actionType = action as DataActionType;

  const entity = getEntityFromRequest(req);

  if (
    EntityCrudCheck[actionType].entityCrudField &&
    !(await configurationApiService.show("entity_crud_settings", entity))[
      actionType
    ]
  ) {
    throw new ForbiddenError(
      `Action '${actionType}' has been disabled for '${entity}'`
    );
  }

  if (
    !(await rolesApiService.canRoleDoThis(
      req.user.role,
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
        entity,
        EntityCrudCheck[actionType].granularPermission
      )
    ))
  ) {
    throw new NotFoundError(ERROR_MESSAGE);
  }
};
