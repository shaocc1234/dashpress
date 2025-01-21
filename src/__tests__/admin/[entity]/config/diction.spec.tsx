import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EntityDictionSettings from "@/pages/admin/[entity]/config/diction";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import { getToastMessage } from "@/tests/utils";

setupApiHandlers();

describe("pages/admin/[entity]/config/diction", () => {
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

  it("should display diction values", async () => {
    render(
      <TestProviders>
        <EntityDictionSettings />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Plural")).toHaveValue("Plural entity-1");
    });
    expect(screen.getByLabelText("Singular")).toHaveValue("Singular entity-1");
  });

  it("should update diction successfully", async () => {
    render(
      <TestProviders>
        <EntityDictionSettings />
      </TestProviders>
    );

    await userEvent.type(screen.getByLabelText("Plural"), "Updated");
    await userEvent.type(screen.getByLabelText("Singular"), "Updated");

    await userEvent.click(
      screen.getByRole("button", { name: "Save Diction Settings" })
    );

    expect(await getToastMessage()).toBe("Diction Settings Saved Successfully");
  });

  it("should display updated diction values", async () => {
    render(
      <TestProviders>
        <EntityDictionSettings />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Plural")).toHaveValue(
        "Plural entity-1Updated"
      );
    });
    expect(screen.getByLabelText("Singular")).toHaveValue(
      "Singular entity-1Updated"
    );
  });
});
