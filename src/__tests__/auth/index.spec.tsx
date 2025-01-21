import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { AuthActions } from "@/frontend/hooks/auth/auth.actions";
import SignIn from "@/pages/auth";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

import { getToastMessage } from "../_/utils";

setupApiHandlers();

Object.defineProperty(window, "location", {
  value: {
    ...window.location,
    replace: jest.fn(),
  },
  writable: true,
});

describe("pages/auth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(
    USE_ROUTER_PARAMS({
      replaceMock: jest.fn(),
    })
  );

  describe("Demo Credentials", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    beforeAll(() => {
      localStorage.clear();
    });

    it("should be hidden when NEXT_PUBLIC_IS_DEMO is false", async () => {
      render(
        <TestProviders>
          <SignIn />
        </TestProviders>
      );

      expect(
        screen.queryByLabelText("Demo App Credentials")
      ).not.toBeInTheDocument();
    });

    it("should be shown when NEXT_PUBLIC_IS_DEMO is true", async () => {
      process.env.NEXT_PUBLIC_IS_DEMO = "true";
      render(
        <TestProviders>
          <SignIn />
        </TestProviders>
      );

      expect(
        await screen.findByLabelText("Demo App Credentials")
      ).toHaveTextContent("Username is rootPassword is password");
    });
  });

  it("should redirect to dashboard when user is authenticated", async () => {
    localStorage.setItem(AuthActions.JWT_TOKEN_STORAGE_KEY, "foo");

    render(
      <TestProviders>
        <SignIn />
      </TestProviders>
    );

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith("/");
    });
  });

  // Need to be able to tell jest to ignore 401 errors as the test crashes after hitting it
  it.skip("should prompt invalid login when invalid credentials are put in", async () => {
    const replaceMock = jest.fn();

    useRouter.mockImplementation(USE_ROUTER_PARAMS({ replaceMock }));

    render(
      <TestProviders>
        <SignIn />
      </TestProviders>
    );

    await userEvent.type(
      await screen.findByLabelText("Username"),
      "Invalid Username"
    );
    await userEvent.type(
      await screen.findByLabelText("Password"),
      "Invalid Password"
    );

    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await getToastMessage()).toBe("Invalid Login");

    expect(localStorage.getItem(AuthActions.JWT_TOKEN_STORAGE_KEY)).toBeNull();

    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it("should redirect to dashboard when user is succesfully authenticated", async () => {
    render(
      <TestProviders>
        <SignIn />
      </TestProviders>
    );

    await userEvent.type(await screen.findByLabelText("Username"), "user");
    await userEvent.type(await screen.findByLabelText("Password"), "password");

    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(localStorage.getItem(AuthActions.JWT_TOKEN_STORAGE_KEY)).toBe(
      "some valid jwt token"
    );
    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith("/");
    });
  });
});
