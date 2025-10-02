<template>
  <div class="week-summary">
    <div class="week-label">Week {{ week.weekNumber }}</div>
    <div class="week-pnl" :class="getPnLClass(week.weekPnL)">
      {{ formatCurrency(week.weekPnL) }}
    </div>
    <div class="week-trades">
      {{ week.weekTradeCount }} trade{{ week.weekTradeCount !== 1 ? 's' : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeekData } from '@/services/interfaces/calendar'
import { formatCurrency, getPnLClass } from '@/services/utils/formatters'

defineProps<{
  week: WeekData
}>()
</script>

<style lang="less" scoped>
@import '@/styles/components/WeekSummary.less';
</style>
