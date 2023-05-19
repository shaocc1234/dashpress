import {
  DATE_FILTER_VALUE,
  FilterOperators,
  IColumnFilterBag,
} from "@hadmean/protozoa";
import { QueryFilter } from "shared/types/data";
import { IPaginationFilters } from "../types";
import { QueryOperationImplementation, QueryOperators } from "./types";
import { relativeDateNotationToActualDate } from "./time.constants";

export abstract class BaseDataAccessService<T> {
  abstract queryOperationImplementation: QueryOperationImplementation<T>;

  abstract count(entity: string, queryFilter: QueryFilter[]): Promise<number>;

  abstract list(
    entity: string,
    select: string[],
    queryFilter: QueryFilter[],
    dataFetchingModifiers: IPaginationFilters
  ): Promise<unknown[]>;

  abstract read<K>(
    entity: string,
    select: string[],
    query: Record<string, unknown>
  ): Promise<K>;

  abstract create(
    entity: string,
    data: Record<string, unknown>,
    primaryField: string
  ): Promise<string | number>;

  abstract update(
    entity: string,
    query: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<void>;

  abstract delete(
    entity: string,
    query: Record<string, unknown>
  ): Promise<void>;

  filterOperatorToQuery(
    query: T,
    column: string,
    { operator, value, value2 }: IColumnFilterBag<unknown>
  ): T {
    if (!operator || !value || !column) {
      return query;
    }
    switch (operator) {
      case FilterOperators.EQUAL_TO:
        return this.queryOperationImplementation[QueryOperators.EQUAL_TO](
          query,
          column,
          value
        );

      case FilterOperators.LESS_THAN:
        return this.queryOperationImplementation[QueryOperators.LESS_THAN](
          query,
          column,
          value
        );

      case FilterOperators.GREATER_THAN:
        return this.queryOperationImplementation[QueryOperators.GREATER_THAN](
          query,
          column,
          value
        );

      case FilterOperators.CONTAINS:
        return this.queryOperationImplementation[QueryOperators.CONTAINS](
          query,
          column,
          value
        );

      case FilterOperators.IN:
        return this.queryOperationImplementation[QueryOperators.IN](
          query,
          column,
          value
        );

      case FilterOperators.NOT_IN:
        return this.queryOperationImplementation[QueryOperators.NOT_IN](
          query,
          column,
          value as string[]
        );

      case FilterOperators.NOT_EQUAL:
        return this.queryOperationImplementation[QueryOperators.NOT_EQUAL](
          query,
          column,
          value
        );

      case FilterOperators.BETWEEN:
        if (!value2) {
          return query;
        }
        return this.queryOperationImplementation[QueryOperators.BETWEEN](
          query,
          column,
          [value, value2]
        );

      case FilterOperators.DATE: {
        const firstTime = relativeDateNotationToActualDate(
          (value as string) || DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE
        );
        const secondTime = relativeDateNotationToActualDate(
          (value2 as string) || DATE_FILTER_VALUE.NOW
        );
        const timeBetween: [Date, Date] =
          firstTime.getTime() < secondTime.getTime()
            ? [firstTime, secondTime]
            : [secondTime, firstTime];
        return this.queryOperationImplementation[QueryOperators.BETWEEN](
          query,
          column,
          timeBetween
        );
      }
    }
  }
}
