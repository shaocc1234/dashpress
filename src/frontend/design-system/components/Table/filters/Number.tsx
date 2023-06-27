import React from "react";
import { FilterOperators, IColumnFilterBag } from "shared/types/data";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { StyledInput } from "../../Form/Styles";
import { IFilterProps } from "./types";

export function FilterTableByNumbers({
  column: { filterValue, setFilter },
}: IFilterProps<IColumnFilterBag<number>, undefined>) {
  return (
    <>
      <StyledInput
        type="number"
        sm
        value={filterValue?.value || ""}
        onChange={(e) =>
          setFilter({
            ...filterValue,
            value: +e.target.value || undefined,
          })
        }
      />
      {filterValue?.operator === FilterOperators.BETWEEN && (
        <>
          <Spacer />
          <StyledInput
            type="number"
            sm
            value={filterValue?.value2 || ""}
            onChange={(e) =>
              setFilter({
                ...filterValue,
                value2: +e.target.value || undefined,
              })
            }
          />
        </>
      )}
    </>
  );
}
