<template>
  <div class="page">
    <div class="column" id="menu">
      <div class="menu-content">
        <h3>Trading Menu</h3>
        <p>Menu options will go here</p>
      </div>
    </div>
    <div class="column" id="calendar">
      <TradingCalendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import TradingCalendar from '../components/TradingCalendar.vue'
</script>

<style lang="less" scoped>
.page {
  display: grid;
  grid-template-columns: 0.5fr 3fr;
  height: 100vh;
  background: #1a1f2a;
}

.column {
  overflow: auto;
}

#menu {
  background: #1e2530;
  border-right: 1px solid #3a4556;

  .menu-content {
    padding: 20px;
    color: #e0e0e0;

    h3 {
      margin-top: 0;
      color: #ffffff;
    }
  }
}

#calendar {
  background: #1e2530;
}
</style>
