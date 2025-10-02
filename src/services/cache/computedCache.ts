import { ComputedCacheKey } from '@/services/enums/cache';

class ComputedCache {
  private cache: Record<ComputedCacheKey, Record<string, unknown>> = this.getClearCacheState();

  private getClearCacheState(): Record<ComputedCacheKey, Record<string, unknown>> {
    return {
      [ComputedCacheKey.STRING_TO_DATE]: {},
      [ComputedCacheKey.DATE_TO_STRING]: {},
      [ComputedCacheKey.MONTH_NAME]: {},
      [ComputedCacheKey.DAY_OF_WEEK]: {},
      [ComputedCacheKey.MONTH_FROM_DATE]: {},
      [ComputedCacheKey.YEAR_FROM_DATE]: {},
      [ComputedCacheKey.CURRENCY_FORMAT]: {},
      [ComputedCacheKey.PNL_CLASS]: {},
      [ComputedCacheKey.TRADE_COUNT_FORMAT]: {},
      [ComputedCacheKey.CALENDAR_DATA]: {},
      [ComputedCacheKey.EMPTY_CALENDAR]: {}
    };
  }

  public loadAndCache<T>(cacheKey: ComputedCacheKey, key: string, fn: () => T): T {
    if (this.cache[cacheKey][key] !== undefined) {
      return this.cache[cacheKey][key] as T;
    }

    const value = fn();
    this.cache[cacheKey][key] = value;

    return value;
  }

  public resetCache(cacheKeys?: ComputedCacheKey | ComputedCacheKey[]): void {
    const handleCacheReset = (key: ComputedCacheKey): void => {
      this.cache[key] = {};
    };

    if (cacheKeys) {
      const keys = Array.isArray(cacheKeys) ? cacheKeys : [cacheKeys];
      keys.forEach(handleCacheReset);
    } else {
      this.cache = this.getClearCacheState();
    }
  }

  public resetCacheForEntity(entityID: string, cacheKeys?: ComputedCacheKey | ComputedCacheKey[]): void {
    const cacheKeysToDelete = cacheKeys
      ? Array.isArray(cacheKeys)
        ? cacheKeys
        : [cacheKeys]
      : Object.values(ComputedCacheKey);

    Object.values(cacheKeysToDelete).forEach((key) => {
      if (this.cache[key]) {
        Object.keys(this.cache[key]).forEach((entryKey) => {
          if (entryKey.startsWith(entityID)) {
            delete this.cache[key][entryKey];
          }
        });
      }
    });
  }

  public getCacheStats(): Record<ComputedCacheKey, number> {
    const stats: Record<string, number> = {};
    Object.keys(this.cache).forEach((key) => {
      stats[key] = Object.keys(this.cache[key as ComputedCacheKey]).length;
    });
    return stats as Record<ComputedCacheKey, number>;
  }
}

export const computedCache = new ComputedCache();
