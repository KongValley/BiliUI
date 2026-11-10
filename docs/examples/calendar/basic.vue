<script setup lang="ts">
import { ref } from 'vue'

const date = ref('2026-11-10')
</script>

<template>
  <BiliSpace direction="vertical" size="md" align="start">
    <BiliCalendar v-model="date" />
    <span class="hint">当前日期：{{ date || '未选择' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
