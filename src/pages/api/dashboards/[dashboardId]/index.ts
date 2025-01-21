import { dashboardWidgetsApiService } from "@/backend/dashboard-widgets/dashboard-widgets.service";
import { requestHandler } from "@/backend/lib/request";
import { UserPermissions } from "@/shared/constants/user";
import type { IAccountProfile } from "@/shared/types/user";

const REQUEST_QUERY_FIELD = "dashboardId";

export default requestHandler(
  {
    GET: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        "authenticatedUser",
        { _type: "requestQuery", options: REQUEST_QUERY_FIELD },
      ]);

      return await dashboardWidgetsApiService.listDashboardWidgets(
        validatedRequest.requestQuery,
        (validatedRequest.authenticatedUser as IAccountProfile).role
      );
    },
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: REQUEST_QUERY_FIELD },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsApiService.createWidget(
        validatedRequest.requestBody,
        validatedRequest.requestQuery
      );
    },
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        { _type: "requestQuery", options: REQUEST_QUERY_FIELD },
        { _type: "requestBody", options: {} },
      ]);
      return await dashboardWidgetsApiService.updateWidgetList(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "notAllowedOnDemo",
      method: ["POST"],
    },
    {
      method: ["PATCH", "POST"],
      _type: "canUser",
      body: UserPermissions.CAN_MANAGE_DASHBOARD,
    },
  ]
);
