<template>
  <div
    class="day-cell"
    :class="{
      'is-previous-month': isPreviousMonth,
      'has-trades': day.tradeCount > 0,
      'no-trades': day.tradeCount === 0
    }"
  >
    <div class="day-number">
      {{ day.dayOfMonth }}
      <span v-if="day.hasNotes" class="note-indicator">📋</span>
    </div>
    <div v-if="day.tradeCount > 0" class="day-content">
      <div class="pnl" :class="getPnLClass(day.pnl)">
        {{ formatCurrency(day.pnl) }}
      </div>
      <div class="trade-count">
        {{ formatTradeCount(day.tradeCount) }}
      </div>
    </div>
    <div v-else class="day-content empty">
      <div class="no-data">$0</div>
      <div class="trade-count">0 trades</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Day } from '@/services/interfaces/calendar'
import { formatCurrency, getPnLClass, formatTradeCount } from '@/services/utils/formatters'
import { getMonthFromDate, getYearFromDate } from '@/services/date'

const props = defineProps<{
  day: Day
  currentMonth: string
  currentYear: number
}>()

const isPreviousMonth = computed(() => {
  const dayMonth = getMonthFromDate(props.day.date)
  const dayYear = getYearFromDate(props.day.date)
  return dayMonth !== props.currentMonth || dayYear !== props.currentYear
})
</script>

<style lang="less" scoped>
@import '@/styles/components/DayCell.less';
</style>
