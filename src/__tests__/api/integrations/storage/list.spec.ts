import handler from "@/pages/api/integrations/storage/list";
import { createAuthenticatedMocks } from "@/tests/api/setups";

describe("/api/integrations/storage/list", () => {
  it("should list storage integrations", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "configurationSchema": {
            "accessKeyId": {
              "label": {
                "id": "pNW+Rt",
                "message": "Access Key ID",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "region": {
              "label": {
                "id": "uJ+Ve2",
                "message": "Region",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "secretAccessKey": {
              "label": {
                "id": "llJ0OR",
                "message": "Secret Access Key",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "s3",
          "title": "AWS S3",
        },
        {
          "configurationSchema": {
            "accessKey": {
              "label": {
                "id": "5k6ZTK",
                "message": "Access Key",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "endpoint": {
              "label": {
                "id": "FCKppt",
                "message": "Endpoint",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "port": {
              "label": {
                "id": "hZ6znB",
                "message": "Port",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "secretKey": {
              "label": {
                "id": "E7bgrN",
                "message": "Secret Key",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "minio",
          "title": "Minio",
        },
        {
          "configurationSchema": {
            "apiKey": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "apiSecret": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "cloudName": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "cloudinary",
          "title": "Cloudinary",
        },
        {
          "configurationSchema": {
            "accessKeyId": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "region": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "secretAccessKey": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "google",
          "title": "Google Cloud Storage",
        },
      ]
    `);
  });
});
