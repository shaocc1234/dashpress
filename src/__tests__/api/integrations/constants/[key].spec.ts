import listHandler from "@/pages/api/integrations/constants";
import handler from "@/pages/api/integrations/constants/[key]";
import {
  createAuthenticatedCustomRoleMocks,
  createAuthenticatedMocks,
  createAuthenticatedViewerMocks,
  setupAllTestData,
  setupRolesTestData,
} from "@/tests/api/setups";

const currentState = async () => {
  const { req, res } = createAuthenticatedMocks({
    method: "GET",
  });

  await listHandler(req, res);

  return res._getJSONData();
};

describe("/api/integrations/constants/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["constants"]);
  });

  describe("Plain keys", () => {
    it("should create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CONSTANT_KEY",
        },
        body: {
          value: "NEW_CONSTANT_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CONSTANT_KEY_1",
            "value": "CONSTANT_KEY_1",
          },
          {
            "key": "CONSTANT_KEY_2",
            "value": "CONSTANT_KEY_2",
          },
          {
            "key": "NEW_CONSTANT_KEY",
            "value": "NEW_CONSTANT_VALUE",
          },
        ]
      `);
    });

    it("should update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "CONSTANT_KEY_2",
        },
        body: {
          value: "UPDATED_CONSTANT_KEY_2",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CONSTANT_KEY_1",
            "value": "CONSTANT_KEY_1",
          },
          {
            "key": "CONSTANT_KEY_2",
            "value": "UPDATED_CONSTANT_KEY_2",
          },
          {
            "key": "NEW_CONSTANT_KEY",
            "value": "NEW_CONSTANT_VALUE",
          },
        ]
      `);
    });

    it("should delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "CONSTANT_KEY_1",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CONSTANT_KEY_2",
            "value": "UPDATED_CONSTANT_KEY_2",
          },
          {
            "key": "NEW_CONSTANT_KEY",
            "value": "NEW_CONSTANT_VALUE",
          },
        ]
      `);
    });
  });

  describe("Group keys", () => {
    it("should not create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CONSTANT___KEY",
        },
        body: {
          value: "NEW_CONSTANT_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be created or updated. They should be updated in the plugin settings",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CONSTANT_KEY_2",
            "value": "UPDATED_CONSTANT_KEY_2",
          },
          {
            "key": "NEW_CONSTANT_KEY",
            "value": "NEW_CONSTANT_VALUE",
          },
        ]
      `);
    });

    it("should not update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "GROUP_CONSTANT___KEY_3",
        },
        body: {
          value: "UPDATED_CONSTANT_KEY_3",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be created or updated. They should be updated in the plugin settings",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CONSTANT_KEY_2",
            "value": "UPDATED_CONSTANT_KEY_2",
          },
          {
            "key": "NEW_CONSTANT_KEY",
            "value": "NEW_CONSTANT_VALUE",
          },
        ]
      `);
    });

    it("should not delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "GROUP_CONSTANT___KEY_3",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be deleted. They will be removed when the plugin is removed",
          "method": "DELETE",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CONSTANT_KEY_2",
            "value": "UPDATED_CONSTANT_KEY_2",
          },
          {
            "key": "NEW_CONSTANT_KEY",
            "value": "NEW_CONSTANT_VALUE",
          },
        ]
      `);
    });
  });

  describe("permission", () => {
    it("should return 403 when user has no permission", async () => {
      const { req, res } = createAuthenticatedViewerMocks({
        method: "PUT",
        query: {
          key: "NEW_CONSTANT_KEY",
        },
        body: {
          value: "NEW_CONSTANT_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
    });

    it("should work when user has correct permission", async () => {
      await setupRolesTestData([
        {
          id: "custom-role",
          permissions: ["CAN_CONFIGURE_APP"],
        },
      ]);

      const { req, res } = createAuthenticatedCustomRoleMocks({
        method: "PUT",
        query: {
          key: "NEW_CONSTANT_KEY",
        },
        body: {
          value: "NEW_CONSTANT_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
    });
  });
});
