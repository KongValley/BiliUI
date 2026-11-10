<script setup lang="ts">
import { ref } from 'vue'

const date = ref('')
const isWeekend = (value: Date) => value.getDay() === 0 || value.getDay() === 6
</script>

<template>
  <BiliSpace direction="vertical" size="md" align="start">
    <BiliCalendar v-model="date" :disabled-date="isWeekend" />
    <span class="hint">周末不可选；点击「今天」会直接跳转到当月</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
