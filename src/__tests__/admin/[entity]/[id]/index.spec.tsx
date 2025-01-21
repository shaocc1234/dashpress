import { render, screen } from "@testing-library/react";

import EntityDetails from "@/pages/admin/[entity]/[id]/index";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/[id]/index", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          entity: "entity-1",
          id: "2",
        },
      })
    );
  });

  it("should show details", async () => {
    render(
      <TestProviders>
        <EntityDetails />
      </TestProviders>
    );

    expect(await screen.findByLabelText("Details Section")).toHaveTextContent(
      "Entity 1 Id Field12Entity 1 Reference FieldEntity 1 String FieldhelloEntity 1 Number Field34Entity 1 Boolean FieldEntity 1 Date Field7th May 2022Entity 1 Enum Fieldfoo"
    );
  });
});
