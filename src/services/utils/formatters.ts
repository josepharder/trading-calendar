import { computedCache } from '@/services/cache/computedCache'
import { ComputedCacheKey } from '@/services/enums/cache'
import { getMonthName } from '@/services/date'

export const formatCurrency = (amount: number): string => {
  return computedCache.loadAndCache(ComputedCacheKey.CURRENCY_FORMAT, amount.toString(), () => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return amount < 0 ? `-${formatted}` : formatted
  })
}

export const getPnLClass = (pnl: number): string => {
  const key = pnl > 0 ? 'pos' : pnl < 0 ? 'neg' : 'neu'
  return computedCache.loadAndCache(ComputedCacheKey.PNL_CLASS, key, () => {
    if (pnl > 0) return 'positive'
    if (pnl < 0) return 'negative'
    return 'neutral'
  })
}

export const formatTradeCount = (count: number): string => {
  return computedCache.loadAndCache(
    ComputedCacheKey.TRADE_COUNT_FORMAT,
    count.toString(),
    () => `${count} trade${count !== 1 ? 's' : ''}`
  )
}

export { getMonthName }
