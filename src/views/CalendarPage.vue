<template>
  <div class="page">
    <div class="column" id="menu">
      <button>click me</button>
    </div>
    <div class="column" id="calendar">
      <button>click me</button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.page {
  display: grid;
  grid-template-columns: 0.5fr 3fr;
  height: 100vh;
}

.column {
  border: 1px solid #ccc;
  margin: 4px;
}
</style>
