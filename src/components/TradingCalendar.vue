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
      <div class="header-cell">Sun</div>
      <div class="header-cell">Mon</div>
      <div class="header-cell">Tue</div>
      <div class="header-cell">Wed</div>
      <div class="header-cell">Thu</div>
      <div class="header-cell">Fri</div>
      <div class="header-cell">Sat</div>
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
import { computed, ref, watch, onMounted } from 'vue'
import DayCell from '@/components/DayCell.vue'
import WeekSummary from '@/components/WeekSummary.vue'
import type { CalendarData, Day, WeekData } from '@/services/interfaces/calendar'
import { formatCurrency, getPnLClass, getMonthName } from '@/services/utils/formatters'
import { fetchCalendarData, generateEmptyCalendar } from '@/services/calendarService'

const currentDate = ref(new Date(2024, 10, 1))
const displayMonth = computed(() => getMonthName(currentDate.value.getMonth()))
const displayYear = computed(() => currentDate.value.getFullYear())

const calendarData = ref<CalendarData | null>(null)

const monthlyPnL = computed(() => calendarData.value?.monthlyPnL || 0)

const loadCalendarData = async () => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const data = await fetchCalendarData(year, month)

  if (data) {
    calendarData.value = data
  } else {
    calendarData.value = generateEmptyCalendar(year, month)
  }
}

const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

watch(currentDate, () => {
  loadCalendarData()
})

onMounted(() => {
  loadCalendarData()
})

const weeks = computed<WeekData[]>(() => {
  if (!calendarData.value?.days || calendarData.value.days.length === 0) {
    return []
  }

  const weeksArray: WeekData[] = []
  let currentWeek: Day[] = []
  let weekIndex = 0

  calendarData.value.days.forEach((day, index) => {
    if (day.dayOfWeek === 0 && currentWeek.length > 0) {
      weeksArray.push({
        weekNumber: calendarData.value!.weeks[weekIndex]?.weekNumber || weekIndex + 1,
        days: currentWeek,
        weekPnL: calendarData.value!.weeks[weekIndex]?.weekPnL || 0,
        weekTradeCount: calendarData.value!.weeks[weekIndex]?.weekTradeCount || 0
      })
      currentWeek = []
      weekIndex++
    }

    currentWeek.push(day)

    if (calendarData.value && index === calendarData.value.days.length - 1 && currentWeek.length > 0) {
      weeksArray.push({
        weekNumber: calendarData.value!.weeks[weekIndex]?.weekNumber || weekIndex + 1,
        days: currentWeek,
        weekPnL: calendarData.value!.weeks[weekIndex]?.weekPnL || 0,
        weekTradeCount: calendarData.value!.weeks[weekIndex]?.weekTradeCount || 0
      })
    }
  })

  return weeksArray
})
</script>

<style lang="less" scoped>
@import '@/styles/components/TradingCalendar.less';
</style>
