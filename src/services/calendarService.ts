import type { CalendarData, Day, WeekSummary, PnLDataEntry } from '@/services/interfaces/calendar';
import pnlData from '@/data/pnl_report.json';
import { getMonthName, getDaysInMonth, createISODate, getDayOfWeek } from '@/services/date';
import { computedCache } from '@/services/cache/computedCache';
import { ComputedCacheKey } from '@/services/enums/cache';

export const fetchCalendarData = async (year: number, month: number): Promise<CalendarData | null> => {
  const cacheKey = `${year}-${month}`;

  return computedCache.loadAndCache(ComputedCacheKey.CALENDAR_DATA, cacheKey, async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const dataStore = pnlData as Record<string, PnLDataEntry>;
    const entry = dataStore[monthKey];

    if (!entry) return null;

    const days: Day[] = entry.days.map((jsonDay) => ({
      ...jsonDay,
      dayOfMonth: parseInt(jsonDay.date.split('-')[2]),
      dayOfWeek: getDayOfWeek(jsonDay.date)
    }));

    return {
      month: entry.month,
      year: entry.year,
      monthlyPnL: 0,
      days,
      weeks: []
    };
  });
};

export const generateEmptyCalendar = (year: number, month: number): CalendarData => {
  const cacheKey = `${year}-${month}`;

  return computedCache.loadAndCache(ComputedCacheKey.EMPTY_CALENDAR, cacheKey, () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = getDayOfWeek(createISODate(year, month, 1));
    const prevMonthDays = getDaysInMonth(year, month - 1);

    const days: Day[] = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const dateString = createISODate(year, month - 1, dayNum);

      days.push({
        date: dateString,
        dayOfMonth: dayNum,
        dayOfWeek: getDayOfWeek(dateString),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = createISODate(year, month, day);

      days.push({
        date: dateString,
        dayOfMonth: day,
        dayOfWeek: getDayOfWeek(dateString),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      });
    }

    const lastDayOfWeek = getDayOfWeek(createISODate(year, month, daysInMonth));
    const daysToAdd = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek;
    for (let i = 1; i <= daysToAdd; i++) {
      const dateString = createISODate(year, month + 1, i);

      days.push({
        date: dateString,
        dayOfMonth: i,
        dayOfWeek: getDayOfWeek(dateString),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      });
    }

    const numWeeks = Math.ceil(days.length / 7);
    const weeks: WeekSummary[] = [];
    for (let i = 0; i < numWeeks; i++) {
      weeks.push({
        weekNumber: i + 1,
        weekPnL: 0,
        weekTradeCount: 0
      });
    }

    return {
      month: getMonthName(month),
      year,
      monthlyPnL: 0,
      days,
      weeks
    };
  });
};

export const clearCalendarCaches = (): void => {
  computedCache.resetCache([ComputedCacheKey.CALENDAR_DATA, ComputedCacheKey.EMPTY_CALENDAR]);
};

export const getLatestDataMonth = (): { year: number; month: number } => {
  const dataStore = pnlData as Record<string, PnLDataEntry>;
  const monthKeys = Object.keys(dataStore).sort().reverse();

  if (monthKeys.length === 0) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }

  const [year, month] = monthKeys[0].split('-').map(Number);
  return { year, month: month - 1 };
};
