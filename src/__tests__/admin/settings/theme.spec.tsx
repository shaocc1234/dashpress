import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ThemeSettings from "@/pages/admin/settings/theme";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import { getToastMessage } from "@/tests/utils";

setupApiHandlers();

describe("pages/admin/settings/theme", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("should display theme values", async () => {
    render(
      <TestProviders>
        <ThemeSettings />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Color Scheme")).toHaveValue("#4b38b3");
    });
  });

  it("should update theme settings successfully", async () => {
    render(
      <TestProviders>
        <ThemeSettings />
      </TestProviders>
    );

    fireEvent.input(screen.getByLabelText("Color Scheme"), {
      target: { value: "#123456" },
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Save Theme Settings" })
    );

    expect(await getToastMessage()).toBe("Theme Settings Saved Successfully");
  });

  it("should display updated theme values", async () => {
    render(
      <TestProviders>
        <ThemeSettings />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Color Scheme")).toHaveValue("#123456");
    });
  });
});
