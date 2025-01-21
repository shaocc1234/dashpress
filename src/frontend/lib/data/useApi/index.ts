import { useLingui } from "@lingui/react";
import { useIsRestoring, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { buildApiOptions } from "../_buildOptions";
import { getQueryCachekey } from "../constants/getQueryCacheKey";
import { ApiRequest } from "../makeRequest";
import type { IUseApiOptions } from "../types";

export function useApi<T>(endPoint: string, options: IUseApiOptions<T>) {
  const isRestoring = useIsRestoring();

  const builtOptions = buildApiOptions(options);
  const router = useRouter();
  const { _ } = useLingui();
  const { data = options.defaultData, ...rest } = useQuery<T>({
    enabled: router.isReady && builtOptions.enabled,
    queryKey: getQueryCachekey(endPoint),
    queryFn: async () => {
      try {
        if (options.request) {
          return await ApiRequest.ACTION(
            options.request.method,
            endPoint,
            options.request.body,
            {
              errorMessage: options.errorMessage
                ? _(options.errorMessage)
                : undefined,
            }
          );
        }
        return await ApiRequest.GET(
          endPoint,
          options.errorMessage ? _(options.errorMessage) : undefined
        );
      } catch (error) {
        if (options.returnUndefinedOnError) {
          return undefined;
        }
        throw error;
      }
    },
    ...builtOptions,
  });
  return { data, ...rest, isLoading: rest.isLoading || isRestoring };
}
