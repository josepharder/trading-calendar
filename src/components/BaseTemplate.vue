<script setup lang="ts">
import { ref } from 'vue';

const counter = ref(0);

function increase(): void {
  counter.value++;
}
</script>

<template>
  <div>Hello {{ counter }}</div>
  <button @click="increase()">Increase</button>
</template>
