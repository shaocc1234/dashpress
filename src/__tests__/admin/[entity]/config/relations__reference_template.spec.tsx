import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EntityRelationsSettings from "@/pages/admin/[entity]/config/relations";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import { getToastMessage } from "@/tests/utils";

setupApiHandlers();

describe("pages/admin/[entity]/config/relations", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          entity: "entity-1",
        },
      })
    );
  });

  describe("Reference Template", () => {
    it("should display reference template", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Display Format")).toHaveValue(
          "entity-1 - {{ name }}"
        );
      });
    });

    it("should error when invalid template is provided", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Reference Template",
      });

      await userEvent.clear(
        await within(currentTab).findByLabelText("Display Format")
      );

      await userEvent.type(
        within(currentTab).getByLabelText("Display Format"),
        "{{ this-entity-does-not-exist }}"
      );

      await userEvent.click(
        within(currentTab).getByRole("button", {
          name: "Save Relation Template",
        })
      );

      expect(within(currentTab).getByRole("alert")).toHaveTextContent(
        "'this-entity-does-not-exist' is not a valid entity field. Valid fields are 'entity-1-id-field', 'entity-1-reference-field', 'entity-1-string-field', 'entity-1-number-field', 'entity-1-boolean-field', 'entity-1-date-field', 'entity-1-enum-field'"
      );
    });

    it("should save valid template", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Reference Template",
      });

      await userEvent.clear(
        await within(currentTab).findByLabelText("Display Format")
      );

      await userEvent.type(
        within(currentTab).getByLabelText("Display Format"),
        "{{{{ entity-1-id-field }} - {{{{ entity-1-string-field }} hello"
      );

      await userEvent.click(
        within(currentTab).getByRole("button", {
          name: "Save Relation Template",
        })
      );
      expect(await getToastMessage()).toBe(
        "Relation Template Saved Successfully"
      );
    });

    it("should display saved template", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Display Format")).toHaveValue(
          "{{ entity-1-id-field }} - {{ entity-1-string-field }} hello"
        );
      });
    });
  });
});
