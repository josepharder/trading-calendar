import { computedCache } from '@/services/cache/computedCache'
import { ComputedCacheKey } from '@/services/enums/cache'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const toISOString = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const getMonthName = (monthIndex: number): string => {
  return MONTHS[monthIndex] || 'Unknown'
}

export const getDaysInMonth = (year: number, month: number): number => {
  const key = `${year}-${month}`
  return computedCache.loadAndCache(ComputedCacheKey.DAYS_IN_MONTH, key, () =>
    new Date(year, month + 1, 0).getDate()
  )
}

export const getMonthIndex = (date: Date): number => {
  return date.getMonth()
}

export const getYear = (date: Date): number => {
  return date.getFullYear()
}

export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)
  return newDate
}

export const setMonthAndYear = (year: number, month: number): Date => {
  return new Date(year, month, 1)
}

export const createISODate = (year: number, month: number, day: number): string => {
  const monthStr = String(month + 1).padStart(2, '0')
  const dayStr = String(day).padStart(2, '0')
  return `${year}-${monthStr}-${dayStr}`
}

export const parseDateParts = (isoDate: string): { year: number; month: number; day: number } => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return { year, month: month - 1, day }
}

export const getDayOfWeek = (isoDate: string): number => {
  return computedCache.loadAndCache(ComputedCacheKey.DAY_OF_WEEK, isoDate, () => {
    const [year, month, day] = isoDate.split('-').map(Number)
    return new Date(year, month - 1, day).getDay()
  })
}

export const getDayOfMonth = (isoDate: string): number => {
  return parseInt(isoDate.split('-')[2])
}
