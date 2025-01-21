import { rest } from "msw";

import { MutationHelpers } from "@/frontend/lib/data/useMutate/mutation-helpers";
import type { IWidgetConfig } from "@/shared/types/dashboard";

import { BASE_TEST_URL } from "./_utils";

let DASHBOARD_WIDGETS: IWidgetConfig[] = [
  {
    _type: "table",
    entity: "entity-1",
    id: "table_id_1",
    queryId: "",
    script: JSON.stringify([
      { name: "John", age: 6 },
      { name: "Jane", age: 5 },
    ]),
    title: "Foo Table",
    span: "2",
    height: "2",
  },
  {
    _type: "summary-card",
    entity: "entity-1",
    color: "red",
    icon: "<p>Some SVG Here</p>",
    queryId: "",
    script: JSON.stringify([{ count: 10 }, { count: 5 }]),
    title: "Bar Card",
    id: "summary_card_id_1",
  },
];

export const dashboardApiHandlers = [
  rest.get(BASE_TEST_URL("/api/dashboards/script"), async (req, res, ctx) => {
    const widgetId = req.url.searchParams.get("widgetId");
    return res(
      ctx.json(
        JSON.parse(DASHBOARD_WIDGETS.find(({ id }) => id === widgetId).script)
      )
    );
  }),
  rest.get(
    BASE_TEST_URL("/api/dashboards/:dashboardId"),
    async (_, res, ctx) => {
      return res(ctx.json(DASHBOARD_WIDGETS));
    }
  ),
  rest.post(
    BASE_TEST_URL("/api/dashboards/:dashboardId"),
    async (req, res, ctx) => {
      const requestBody = await req.json();
      if (
        req.params.dashboardId === "test-dashboard-id" &&
        [
          '{"icon":"Download","title":"New Summary Card","_type":"summary-card","entity":"entity-1","span":"3","height":"4","queryId":"foo","script":"return 1","color":"green","id":"new_id_1"}',
          `{"icon":"Activity","title":"New Table","_type":"table","entity":"entity-1","span":"2","queryId":"bar","height":"3","script":"return 2","id":"new_id_2"}`,
        ].includes(JSON.stringify(requestBody))
      ) {
        DASHBOARD_WIDGETS.push(requestBody);
        return res(ctx.status(204));
      }
      return res(ctx.status(500));
    }
  ),
  rest.patch(
    BASE_TEST_URL("/api/dashboards/:dashboardId/:widgetId"),
    async (req, res, ctx) => {
      const requestBody = await req.json();
      if (
        req.params.dashboardId === "test-dashboard-id" &&
        [
          `{"_type":"table","entity":"entity-2","id":"table_id_1","queryId":"foo","script":"[{\\"name\\":\\"John\\",\\"age\\":6},{\\"name\\":\\"Jane\\",\\"age\\":5}]return 1","title":"Foo TableUpdated","span":"1","height":"2"}`,
          `{"_type":"summary-card","entity":"entity-2","color":"red","icon":"<p>Some SVG Here</p><p>Custom Icon</p>","queryId":"bar","script":"[{\\"count\\":10},{\\"count\\":5}]return 1","title":"Bar CardUpdated","id":"summary_card_id_1","span":"3","height":"4"}`,
        ].includes(JSON.stringify(requestBody))
      ) {
        const index = DASHBOARD_WIDGETS.findIndex(
          ({ id }) => id === req.params.widgetId
        );
        DASHBOARD_WIDGETS[index] = requestBody;
        return res(ctx.status(204));
      }
      return res(ctx.status(500));
    }
  ),
  rest.patch(
    BASE_TEST_URL("/api/dashboards/:dashboardId"),
    async (req, res, ctx) => {
      DASHBOARD_WIDGETS = MutationHelpers.sortOrder(
        DASHBOARD_WIDGETS,
        await req.json()
      );
      return res(ctx.status(204));
    }
  ),
  rest.delete(
    BASE_TEST_URL("/api/dashboards/:dashboardId/:widgetId"),
    async (req, res, ctx) => {
      DASHBOARD_WIDGETS.splice(
        DASHBOARD_WIDGETS.findIndex(({ id }) => id === req.params.widgetId),
        1
      );

      return res(ctx.status(204));
    }
  ),
];
