import { computedCache } from '@/services/cache/computedCache'
import { ComputedCacheKey } from '@/services/enums/cache'

export const parseDate = (dateString: string): Date => {
  return computedCache.loadAndCache(ComputedCacheKey.STRING_TO_DATE, dateString, () => new Date(dateString))
}

export const toISOString = (date: Date): string => {
  const key = date.getTime().toString()
  return computedCache.loadAndCache(ComputedCacheKey.DATE_TO_STRING, key, () => date.toISOString().split('T')[0])
}

export const getMonthName = (monthIndex: number): string => {
  return computedCache.loadAndCache(ComputedCacheKey.MONTH_NAME, monthIndex.toString(), () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    return months[monthIndex] || 'Unknown'
  })
}

export const getDayOfWeek = (dateString: string): number => {
  return computedCache.loadAndCache(ComputedCacheKey.DAY_OF_WEEK, dateString, () => parseDate(dateString).getDay())
}

export const getMonthFromDate = (dateString: string): string => {
  return computedCache.loadAndCache(ComputedCacheKey.MONTH_FROM_DATE, dateString, () =>
    parseDate(dateString).toLocaleString('en-US', { month: 'long' })
  )
}

export const getYearFromDate = (dateString: string): number => {
  return computedCache.loadAndCache(ComputedCacheKey.YEAR_FROM_DATE, dateString, () =>
    parseDate(dateString).getFullYear()
  )
}
