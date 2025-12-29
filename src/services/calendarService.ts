import type { CalendarData, Day, WeekSummary } from '@/services/interfaces/calendar'
import mockDataStore from '@/data/mockTradingDataStore.json'
import { getMonthName } from '@/services/date'
import { toISOString } from '@/services/date'
import { computedCache } from '@/services/cache/computedCache'
import { ComputedCacheKey } from '@/services/enums/cache'

export const fetchCalendarData = async (year: number, month: number): Promise<CalendarData | null> => {
  const cacheKey = `${year}-${month}`

  return computedCache.loadAndCache(ComputedCacheKey.CALENDAR_DATA, cacheKey, async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
    const dataStore = mockDataStore as Record<string, CalendarData>

    return dataStore[monthKey] || null
  })
}

export const generateEmptyCalendar = (year: number, month: number): CalendarData => {
  const cacheKey = `${year}-${month}`

  return computedCache.loadAndCache(ComputedCacheKey.EMPTY_CALENDAR, cacheKey, () => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const firstDayOfWeek = firstDay.getDay()
    const prevMonthLastDay = new Date(year, month, 0)
    const prevMonthDays = prevMonthLastDay.getDate()

    const days: Day[] = []

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i
      const date = new Date(year, month - 1, dayNum)
      const dateString = toISOString(date)

      days.push({
        date: dateString,
        dayOfMonth: dayNum,
        dayOfWeek: date.getDay(),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = toISOString(date)

      days.push({
        date: dateString,
        dayOfMonth: day,
        dayOfWeek: date.getDay(),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      })
    }

    const lastDayOfWeek = lastDay.getDay()
    const daysToAdd = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek
    for (let i = 1; i <= daysToAdd; i++) {
      const date = new Date(year, month + 1, i)
      const dateString = toISOString(date)

      days.push({
        date: dateString,
        dayOfMonth: i,
        dayOfWeek: date.getDay(),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      })
    }

    const numWeeks = Math.ceil(days.length / 7)
    const weeks: WeekSummary[] = []
    for (let i = 0; i < numWeeks; i++) {
      weeks.push({
        weekNumber: i + 1,
        weekPnL: 0,
        weekTradeCount: 0
      })
    }

    return {
      month: getMonthName(month),
      year,
      monthlyPnL: 0,
      days,
      weeks
    }
  })
}

export const clearCalendarCaches = (): void => {
  computedCache.resetCache([ComputedCacheKey.CALENDAR_DATA, ComputedCacheKey.EMPTY_CALENDAR])
}

export const getLatestDataMonth = (): { year: number; month: number } => {
  const dataStore = mockDataStore as Record<string, CalendarData>
  const monthKeys = Object.keys(dataStore).sort().reverse()

  if (monthKeys.length === 0) {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  }

  const [year, month] = monthKeys[0].split('-').map(Number)
  return { year, month: month - 1 }
}
