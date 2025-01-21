/* eslint-disable jest/no-conditional-expect */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import EntityCrudSettings from "@/pages/admin/[entity]/config/crud";
import { BASE_TEST_URL } from "@/tests/api/handlers/_utils";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

const server = setupApiHandlers();

describe("pages/admin/[entity]/config/crud", () => {
  server.use(
    rest.get(
      BASE_TEST_URL("/api/entities/:entity/fields"),
      async (_, res, ctx) => {
        return res(
          ctx.json([
            {
              name: `field-1`,
              isRequired: true,
              type: "number",
            },
          ])
        );
      }
    )
  );

  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should not have toggling functionality for tables", async () => {
    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          entity: "entity-1",
        },
      })
    );

    render(
      <TestProviders>
        <EntityCrudSettings />
      </TestProviders>
    );

    expect(
      await screen.findByRole("tab", { selected: true })
    ).toHaveTextContent("Table");

    expect(
      screen.queryByRole("button", {
        name: `Disable Table Functionality`,
      })
    ).not.toBeInTheDocument();

    expect(
      await screen.findByRole("button", {
        name: `Enable Create Functionality`,
        hidden: true,
      })
    ).not.toBeVisible();
  });

  describe.each([
    { tab: "Update", id: "update" },
    { tab: "Details", id: "details" },
    { tab: "Create", id: "create" },
    { tab: "Delete", id: "delete" },
  ])("$tab feature", ({ tab, id }) => {
    beforeAll(() => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            entity: "entity-1",
            tab: id,
          },
        })
      );
    });

    it("should toggle off functionality", async () => {
      render(
        <TestProviders>
          <EntityCrudSettings />
        </TestProviders>
      );

      const currentTab = screen.getByRole("tabpanel", { name: tab });

      if (tab !== "Delete") {
        expect(
          await within(currentTab).findByRole("switch", { name: "Field 1" })
        ).toBeInTheDocument();
      }

      await userEvent.click(
        await within(currentTab).findByRole("button", {
          name: `Enable ${tab} Functionality`,
        })
      );
      if (tab !== "Delete") {
        expect(
          within(currentTab).queryByRole("switch", { name: "Field 1" })
        ).not.toBeInTheDocument();
      }

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "CRUD Settings Saved Successfully"
      );
    });

    it("should toggle on functionality", async () => {
      render(
        <TestProviders>
          <EntityCrudSettings />
        </TestProviders>
      );

      const currentTab = screen.getByRole("tabpanel", { name: tab });

      if (tab !== "Delete") {
        expect(
          within(currentTab).queryByRole("switch", { name: "Field 1" })
        ).not.toBeInTheDocument();
      }

      await userEvent.click(
        await within(currentTab).findByRole("button", {
          name: `Enable ${tab} Functionality`,
        })
      );
      if (tab !== "Delete") {
        expect(
          within(currentTab).getByRole("switch", { name: "Field 1" })
        ).toBeInTheDocument();
      }
      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "CRUD Settings Saved Successfully"
      );
    });
  });
});
