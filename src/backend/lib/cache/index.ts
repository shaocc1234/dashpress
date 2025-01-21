import { configApiService, ConfigKeys } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";
import { MemoryCacheAdaptor } from "./MemoryCacheAdaptor";
import { RedisCacheAdaptor } from "./RedisCacheAdaptor";
import { CacheAdaptorTypes } from "./types";

export { AbstractCacheService };

export function createCacheService(): AbstractCacheService {
  const configBag: Record<CacheAdaptorTypes, AbstractCacheService> = {
    [CacheAdaptorTypes.Memory]: new MemoryCacheAdaptor(configApiService),
    [CacheAdaptorTypes.Redis]: new RedisCacheAdaptor(configApiService),
  };

  return configBag[
    configApiService.getConfigValue<CacheAdaptorTypes>(ConfigKeys.CACHE_ADAPTOR)
  ];
}
