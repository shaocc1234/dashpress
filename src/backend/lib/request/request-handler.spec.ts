import { createAuthenticatedMocks } from "@/tests/api/setups";

import { requestHandler } from ".";

describe("/api/requestHandler", () => {
  it("should call error on non implemented request method", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "OPTIONS",
    });

    await requestHandler({})(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toBe("Method 'OPTIONS' Not Allowed");
  });

  it("should perform selective method validations correctly", async () => {
    const handler = requestHandler(
      {
        GET: () => {
          return true;
        },
        POST: () => {
          return true;
        },
      },
      [
        {
          _type: "guest",
          method: ["GET"],
        },
      ]
    );
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);

    const { req: guestReq, res: guestRes } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(guestReq, guestRes);

    expect(guestRes._getStatusCode()).toBe(401);
  });
});
