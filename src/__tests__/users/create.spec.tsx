import { render, screen } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";

import UserCreate from "@/pages/users/create";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

import { getToastMessage, selectCombobox } from "../_/utils";

setupApiHandlers();

describe("pages/users/create", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should create new user", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(USE_ROUTER_PARAMS({ pushMock }));

    render(
      <TestProviders>
        <UserCreate />
      </TestProviders>
    );

    await userEvent.type(
      await screen.findByLabelText("Username"),
      "someusername"
    );
    await userEvent.type(screen.getByLabelText("Name"), "Some Name");

    await selectCombobox("Role", "Viewer");

    await userEvent.type(screen.getByLabelText("Password"), "Password");

    await userEvent.click(screen.getByRole("button", { name: "Create User" }));

    expect(await getToastMessage()).toBe(
      "User Created SuccessfullyView Details"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "View Details" }),
      { pointerEventsCheck: PointerEventsCheckLevel.Never }
    );
    expect(pushMock).toHaveBeenCalledWith("/users/someusername");
  });
});
