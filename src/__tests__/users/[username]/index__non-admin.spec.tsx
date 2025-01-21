import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import UserUpdate from "@/pages/users/[username]/index";
import { UserPermissions } from "@/shared/constants/user";
import type { IAuthenticatedUserBag } from "@/shared/types/user";
import { BASE_TEST_URL } from "@/tests/api/handlers/_utils";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

const server = setupApiHandlers();

const VIEWER: IAuthenticatedUserBag = {
  name: "Root User",
  permissions: [UserPermissions.CAN_MANAGE_USERS],
  role: "custom-role",
  username: "root",
};

describe("pages/users/[username]/index", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    server.use(
      rest.get(BASE_TEST_URL("/api/account/mine"), async (_, res, ctx) => {
        return res(ctx.json(VIEWER));
      })
    );
  });

  describe("Reset Password", () => {
    it("should be hidden when user doesn't have the permission to reset password", async () => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            username: "foo",
          },
        })
      );

      render(
        <TestProviders>
          <UserUpdate />
        </TestProviders>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Role")).toBeInTheDocument();
      });

      expect(
        screen.queryByRole("heading", { name: "Reset User Password" })
      ).not.toBeInTheDocument();
    });

    it("should be hidden when user doesn't have the permission to reset password and is current user", async () => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            username: "root",
          },
        })
      );
      render(
        <TestProviders>
          <UserUpdate />
        </TestProviders>
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Role")).toBeInTheDocument();
      });

      expect(
        screen.queryByRole("heading", { name: "Reset User Password" })
      ).not.toBeInTheDocument();
    });
  });
});
