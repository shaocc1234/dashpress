import { requestHandler } from "@/backend/lib/request";
import { rolesApiController } from "@/backend/roles/roles.controller";
import { UserPermissions } from "@/shared/constants/user";
import { BASE_ROLE_FORM_SCHEMA } from "@/shared/form-schemas/roles/base";

export default requestHandler(
  {
    GET: async () => {
      return await rolesApiController.listRoles();
    },

    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: BASE_ROLE_FORM_SCHEMA,
        },
      ]);
      return await rolesApiController.createRole(validatedRequest.requestBody);
    },
  },
  [
    {
      _type: "canUser",
      body: UserPermissions.CAN_MANAGE_PERMISSIONS,
    },
  ]
);
