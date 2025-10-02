<template>
  <div class="trading-calendar">
    <div class="calendar-header">
      <div class="month-navigation">
        <button class="nav-button" @click="previousMonth" aria-label="Previous month">
          ←
        </button>
        <h2 class="month-title">{{ displayMonth }}, {{ displayYear }}</h2>
        <button class="nav-button" @click="nextMonth" aria-label="Next month">
          →
        </button>
      </div>
      <div class="monthly-pnl">
        Monthly P&L:
        <span :class="getPnLClass(monthlyPnL)">{{ formatCurrency(monthlyPnL) }}</span>
      </div>
    </div>

    <div class="calendar-grid">
      <!-- Header row -->
      <div class="header-cell">Sun</div>
      <div class="header-cell">Mon</div>
      <div class="header-cell">Tue</div>
      <div class="header-cell">Wed</div>
      <div class="header-cell">Thu</div>
      <div class="header-cell">Fri</div>
      <div class="header-cell">Sat</div>
      <div class="header-cell">Total</div>

      <!-- Week rows -->
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
import { computed, ref } from 'vue'
import DayCell from '@/components/DayCell.vue'
import WeekSummary from '@/components/WeekSummary.vue'
import type { CalendarData, Day, WeekData } from '@/services/interfaces/calendar'
import { formatCurrency, getPnLClass, getMonthName } from '@/services/utils/formatters'
import mockData from '../data/mockTradingData.json'

// Current date state
const currentDate = ref(new Date())
const displayMonth = computed(() => getMonthName(currentDate.value.getMonth()))
const displayYear = computed(() => currentDate.value.getFullYear())

// Load calendar data (in real app, this would fetch from API based on currentDate)
const calendarData = ref<CalendarData>(mockData as CalendarData)

const monthlyPnL = computed(() => calendarData.value?.monthlyPnL || 0)

// Navigation functions
const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  // TODO: Fetch data for new month from API
  console.log('Navigate to:', displayMonth.value, displayYear.value)
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  // TODO: Fetch data for new month from API
  console.log('Navigate to:', displayMonth.value, displayYear.value)
}

// Compute weeks from calendar data
const weeks = computed<WeekData[]>(() => {
  if (!calendarData.value?.days || calendarData.value.days.length === 0) {
    return []
  }

  const weeksArray: WeekData[] = []
  let currentWeek: Day[] = []
  let weekIndex = 0

  calendarData.value.days.forEach((day, index) => {
    // Start a new week on Sunday (dayOfWeek === 0)
    if (day.dayOfWeek === 0 && currentWeek.length > 0) {
      weeksArray.push({
        weekNumber: calendarData.value.weeks[weekIndex]?.weekNumber || weekIndex + 1,
        days: currentWeek,
        weekPnL: calendarData.value.weeks[weekIndex]?.weekPnL || 0,
        weekTradeCount: calendarData.value.weeks[weekIndex]?.weekTradeCount || 0
      })
      currentWeek = []
      weekIndex++
    }

    currentWeek.push(day)

    // Last day - push remaining days as final week
    if (index === calendarData.value.days.length - 1 && currentWeek.length > 0) {
      weeksArray.push({
        weekNumber: calendarData.value.weeks[weekIndex]?.weekNumber || weekIndex + 1,
        days: currentWeek,
        weekPnL: calendarData.value.weeks[weekIndex]?.weekPnL || 0,
        weekTradeCount: calendarData.value.weeks[weekIndex]?.weekTradeCount || 0
      })
    }
  })

  return weeksArray
})
</script>

<style lang="less" scoped>
@import '@/styles/components/TradingCalendar.less';
</style>
