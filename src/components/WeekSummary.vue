<template>
  <div
    class="week-summary"
    :class="{
      'has-trades': week.weekTradeCount > 0,
      'no-trades': week.weekTradeCount === 0
    }"
  >
    <div class="week-label">Week {{ week.weekNumber }}</div>
    <div class="week-pnl" :class="getPnLClass(week.weekPnL)">
      {{ formatCurrency(week.weekPnL) }}
    </div>
    <div class="week-trades">
      {{ formatTradeCount(week.weekTradeCount) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeekData } from '@/services/interfaces/calendar'
import { formatCurrency, getPnLClass, formatTradeCount } from '@/services/utils/formatters'

defineProps<{
  week: WeekData
}>()
</script>

<style lang="less" scoped>
@import '@/styles/components/WeekSummary.less';
</style>
