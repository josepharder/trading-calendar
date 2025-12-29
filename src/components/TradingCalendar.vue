<template>
  <div class="trading-calendar">
    <div class="calendar-header">
      <div class="month-navigation">
        <button class="nav-button" @click="previousMonth" aria-label="Previous month">←</button>
        <h2 class="month-title">{{ displayMonth }}, {{ displayYear }}</h2>
        <button class="nav-button" @click="nextMonth" aria-label="Next month">→</button>
      </div>
      <div class="monthly-pnl">
        Monthly P&L:
        <span :class="getPnLClass(monthlyPnL)">{{ formatCurrency(monthlyPnL) }}</span>
      </div>
    </div>

    <div class="calendar-grid">
      <div class="header-cell">Mon</div>
      <div class="header-cell">Tue</div>
      <div class="header-cell">Wed</div>
      <div class="header-cell">Thu</div>
      <div class="header-cell">Fri</div>
      <div class="header-cell">Sat</div>
      <div class="header-cell">Sun</div>
      <div class="header-cell">Total</div>

      <template v-for="(week, weekIndex) in weeks" :key="weekIndex">
        <DayCell
          v-for="day in week.days"
          :key="day.date"
          :day="day"
          :currentMonth="displayMonth"
          :currentYear="displayYear"
        />
        <WeekSummary :week="week" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import DayCell from '@/components/DayCell.vue';
import WeekSummary from '@/components/WeekSummary.vue';
import type { CalendarData, Day, WeekData } from '@/services/interfaces/calendar';
import { formatCurrency, getPnLClass } from '@/services/utils/formatters';
import { fetchCalendarData, generateEmptyCalendar, getLatestDataMonth } from '@/services/calendarService';
import {
  getMonthName,
  getDaysInMonth,
  getMonthIndex,
  getYear,
  addMonths,
  setMonthAndYear,
  createISODate,
  getDayOfWeek
} from '@/services/date';

const latestData = getLatestDataMonth();
const currentDate = ref(setMonthAndYear(latestData.year, latestData.month));
const displayMonth = computed(() => getMonthName(getMonthIndex(currentDate.value)));
const displayYear = computed(() => getYear(currentDate.value));

const calendarData = ref<CalendarData | null>(null);

const monthlyPnL = computed(() => {
  if (!calendarData.value?.days) return 0;

  const year = getYear(currentDate.value);
  const month = getMonthIndex(currentDate.value);
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  return calendarData.value.days
    .filter((day) => day.date.startsWith(monthKey))
    .reduce((sum, day) => sum + (day.pnl || 0), 0);
});

const loadCalendarData = async () => {
  const year = getYear(currentDate.value);
  const month = getMonthIndex(currentDate.value);

  const data = await fetchCalendarData(year, month);

  if (data) {
    calendarData.value = data;
  } else {
    calendarData.value = generateEmptyCalendar(year, month);
  }
};

const previousMonth = () => {
  currentDate.value = addMonths(currentDate.value, -1);
};

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1);
};

watch(currentDate, () => {
  loadCalendarData();
});

onMounted(() => {
  loadCalendarData();
});

const weeks = computed<WeekData[]>(() => {
  const year = getYear(currentDate.value);
  const month = getMonthIndex(currentDate.value);

  const firstDayOfWeek = getDayOfWeek(createISODate(year, month, 1));
  const mondayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const daysInMonth = getDaysInMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const dayDataMap = new Map<string, Day>();
  if (calendarData.value?.days) {
    calendarData.value.days.forEach((day) => {
      dayDataMap.set(day.date, day);
    });
  }

  const allDays: Day[] = [];

  // Add days from previous month
  for (let i = mondayOffset - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const dateString = createISODate(year, month - 1, dayNum);
    const dayData = dayDataMap.get(dateString);

    allDays.push(
      dayData || {
        date: dateString,
        dayOfMonth: dayNum,
        dayOfWeek: getDayOfWeek(dateString),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      }
    );
  }

  // Add days from current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = createISODate(year, month, day);
    const dayData = dayDataMap.get(dateString);

    allDays.push(
      dayData || {
        date: dateString,
        dayOfMonth: day,
        dayOfWeek: getDayOfWeek(dateString),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      }
    );
  }

  // Add days from next month
  const lastDayOfWeek = getDayOfWeek(createISODate(year, month, daysInMonth));
  const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  for (let i = 1; i <= daysToAdd; i++) {
    const dateString = createISODate(year, month + 1, i);
    const dayData = dayDataMap.get(dateString);

    allDays.push(
      dayData || {
        date: dateString,
        dayOfMonth: i,
        dayOfWeek: getDayOfWeek(dateString),
        pnl: 0,
        tradeCount: 0,
        hasNotes: false
      }
    );
  }

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  const weeksArray: WeekData[] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    const weekDays = allDays.slice(i, i + 7);
    const currentMonthDays = weekDays.filter((day) => day.date.startsWith(monthKey));
    const weekPnL = currentMonthDays.reduce((sum, day) => sum + (day.pnl || 0), 0);
    const weekTradeCount = currentMonthDays.reduce((sum, day) => sum + (day.tradeCount || 0), 0);

    weeksArray.push({
      weekNumber: Math.floor(i / 7) + 1,
      days: weekDays,
      weekPnL,
      weekTradeCount
    });
  }

  return weeksArray;
});
</script>

<style lang="less" scoped>
@import '@/styles/components/TradingCalendar.less';
</style>
