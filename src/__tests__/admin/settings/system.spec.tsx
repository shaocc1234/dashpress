import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SystemSettings from "@/pages/admin/settings/system";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import { getToastMessage } from "@/tests/utils";

setupApiHandlers();

describe("pages/admin/settings/system", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("should display system values", async () => {
    render(
      <TestProviders>
        <SystemSettings />
      </TestProviders>
    );
    await waitFor(async () => {
      expect(
        await screen.findByLabelText("Token Validity Duration In Days")
      ).toHaveValue(5);
    });
  });

  it("should update system settings successfully", async () => {
    render(
      <TestProviders>
        <SystemSettings />
      </TestProviders>
    );

    await userEvent.type(
      screen.getByLabelText("Token Validity Duration In Days"),
      "9"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save System Settings" })
    );

    expect(await getToastMessage()).toBe("System Settings Saved Successfully");
  });

  it("should display updated system values", async () => {
    render(
      <TestProviders>
        <SystemSettings />
      </TestProviders>
    );
    await waitFor(() => {
      expect(
        screen.getByLabelText("Token Validity Duration In Days")
      ).toHaveValue(59);
    });
  });
});
