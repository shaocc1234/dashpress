import handler from "@/pages/api/roles/index";
import { createAuthenticatedMocks, setupAllTestData } from "@/tests/api/setups";

describe("/api/roles/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["roles"]);
  });

  it("should list all roles", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "label": "Some Admin Permissions",
          "value": "some-admin-permissions",
        },
        {
          "label": "View All Data Only",
          "value": "view-all-data-only",
        },
        {
          "label": "Super Admin",
          "value": "creator",
        },
        {
          "label": "Viewer",
          "value": "viewer",
        },
      ]
    `);
  });

  it("should create new role", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "POST",
      body: {
        name: "New Role",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(201);

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toHaveLength(5);
    expect(res._getJSONData()[2]).toMatchInlineSnapshot(`
      {
        "label": "New Role",
        "value": "new-role",
      }
    `);
  });

  it("should not re-create existing role", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "POST",
      body: {
        name: "New Role",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(400);
    expect(postRequest.res._getJSONData()).toEqual({
      message: "Role already exist",
      method: "POST",
      name: "BadRequestError",
      path: "",
      statusCode: 400,
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toHaveLength(5);
  });

  it("should not create system role", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "POST",
      body: {
        name: "Viewer",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(400);
    expect(postRequest.res._getJSONData()).toEqual({
      message: "Role already exist",
      method: "POST",
      name: "BadRequestError",
      path: "",
      statusCode: 400,
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toHaveLength(5);
  });
});
