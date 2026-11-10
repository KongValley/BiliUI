<script setup lang="ts">
import { ref } from 'vue'

const time = ref('')
</script>

<template>
  <BiliSpace direction="vertical" :size="12" style="width: 220px">
    <BiliTimePicker v-model="time" placeholder="选择时间" />
    <span class="hint">当前值：{{ time || '空' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
