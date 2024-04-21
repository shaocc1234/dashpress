import { render, screen, within, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import ListRoles from "pages/roles";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { getTableRows } from "__tests__/_/utils/getTableRows";

setupApiHandlers();

describe("pages/roles", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should list roles", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      isReady: true,
    }));
    render(
      <ApplicationRoot>
        <ListRoles />
      </ApplicationRoot>
    );

    expect(await getTableRows(await screen.findByRole("table")))
      .toMatchInlineSnapshot(`
      [
        "Role|Action",
        "Creator",
        "Viewer",
        "Role 1",
        "Role 2",
      ]
    `);
  });

  it("should link to create role", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
      isReady: true,
    }));

    render(
      <ApplicationRoot>
        <ListRoles />
      </ApplicationRoot>
    );
    await userEvent.click(screen.getByRole("button", { name: "Add New Role" }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/roles/create");
    });
  });

  it("should link to role permissions for only non-system roles", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
      isReady: true,
    }));

    render(
      <ApplicationRoot>
        <ListRoles />
      </ApplicationRoot>
    );

    const tableRows = await screen.findAllByRole("link", { name: "Edit Role" });

    expect(tableRows).toHaveLength(2);
  });

  it("should delete role for only non-system roles", async () => {
    const pushMock = jest.fn();
    const replaceMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
      replace: replaceMock,
      isReady: true,
    }));

    render(
      <ApplicationRoot>
        <ListRoles />
      </ApplicationRoot>
    );

    const tableRows = await screen.findAllByRole("row");

    expect(tableRows).toHaveLength(5);

    expect(
      within(tableRows[1]).queryByRole("button", {
        name: "Delete Role",
      })
    ).not.toBeInTheDocument();

    expect(
      within(tableRows[2]).queryByRole("button", {
        name: "Delete Role",
      })
    ).not.toBeInTheDocument();

    await userEvent.click(
      within(tableRows[4]).getByRole("button", {
        name: "Delete Role",
      })
    );

    const confirmBox = await screen.findByRole("alertdialog", {
      name: "Confirm Delete",
    });

    await userEvent.click(
      await within(confirmBox).findByRole("button", { name: "Confirm" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Deleted Successfully"
    );

    expect(replaceMock).toHaveBeenCalledWith("/roles");
    expect(await screen.findAllByRole("row")).toHaveLength(4);
  });
});
