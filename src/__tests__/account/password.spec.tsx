import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AccountPassword from "@/pages/account/password";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import { closeAllToasts, getToastMessage } from "@/tests/utils";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

describe("pages/account/password", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should update password", async () => {
    render(
      <TestProviders>
        <AccountPassword />
      </TestProviders>
    );
    await userEvent.type(
      await screen.findByLabelText("Old Password"),
      "Old Password"
    );
    await userEvent.type(screen.getByLabelText("New Password"), "New Password");
    await userEvent.type(
      screen.getByLabelText("New Password Again"),
      "New Password"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Update Password" })
    );

    expect(await getToastMessage()).toBe("Password Updated Successfully");

    await closeAllToasts();
  });

  it("should show different error message on demo", async () => {
    process.env.NEXT_PUBLIC_IS_DEMO = "true";

    render(
      <TestProviders>
        <AccountPassword />
      </TestProviders>
    );

    await userEvent.type(
      await screen.findByLabelText("Old Password"),
      "Old Password"
    );
    await userEvent.type(screen.getByLabelText("New Password"), "New Password");
    await userEvent.type(
      screen.getByLabelText("New Password Again"),
      "New Password"
    );

    await closeAllToasts();

    await userEvent.click(
      screen.getByRole("button", { name: "Update Password" })
    );

    expect(await getToastMessage()).toBe(
      "Password will not be changed on demo account"
    );
  });
});
