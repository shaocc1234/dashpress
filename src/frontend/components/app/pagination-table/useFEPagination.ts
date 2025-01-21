import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { getQueryCachekey } from "@/frontend/lib/data/constants/getQueryCacheKey";
import { ApiRequest } from "@/frontend/lib/data/makeRequest";
import type {
  FieldQueryFilter,
  IPaginatedDataState,
  PaginatedData,
} from "@/shared/types/data";
import { FilterOperators } from "@/shared/types/data";

const DEFAULT_PAGE_SIZE = 10;

const compareNumbers = (value1: number, value2: number) => value1 - value2;
const compareString = (value1: string, value2: string) =>
  value1.localeCompare(value2);

export function useFEPagination<T>(
  endPoint: string,
  dataState: IPaginatedDataState<T>
): UseQueryResult<PaginatedData<T>> {
  return useQuery<PaginatedData<T>>({
    queryKey: getQueryCachekey(endPoint),
    queryFn: async () => {
      return await ApiRequest.GET(endPoint, "Data could not be retrieved");
    },
    select: (data: any) => {
      let returnData: T[] = data as unknown as T[];
      if (dataState.filters) {
        returnData = returnData.filter((datum) => {
          return dataState.filters.every(($filter) => {
            const filter = $filter as unknown as FieldQueryFilter;
            const filterValue = filter.value.value;
            const currentValue = datum[filter.id];
            if (!filterValue) {
              return true;
            }
            switch (filter.value.operator) {
              case FilterOperators.CONTAINS:
                return currentValue
                  .toLowerCase()
                  .includes((filterValue as string).toLowerCase());
              case FilterOperators.EQUAL_TO:
                return currentValue === filterValue;
              case FilterOperators.NOT_EQUAL:
                return currentValue !== filterValue;
              case FilterOperators.LESS_THAN:
                return currentValue < filterValue;
              case FilterOperators.GREATER_THAN:
                return currentValue > filterValue;
              case FilterOperators.IN:
                return (filterValue as string[]).includes(currentValue);
              case FilterOperators.NOT_IN:
                return !(filterValue as string[]).includes(currentValue);
            }
            return true;
          });
        });
      }

      if (dataState.sortBy && dataState.sortBy.length > 0) {
        const { id, desc } = dataState.sortBy[0];

        returnData = returnData.sort((a, b) => {
          const value1 = (desc ? b : a)[id];
          const value2 = (desc ? a : b)[id];
          if (typeof value1 === "number") {
            return compareNumbers(value1, value2);
          }

          return compareString(value1, value2);
        });
      }
      const totalReturnData = returnData.length;
      const pageSize = dataState.pageSize || DEFAULT_PAGE_SIZE;

      return {
        pageIndex: dataState.pageIndex,
        pageSize,
        totalRecords: totalReturnData,
        data: returnData.slice(
          (dataState.pageIndex - 1) * pageSize,
          dataState.pageIndex * pageSize
        ),
      };
    },
  });
}
