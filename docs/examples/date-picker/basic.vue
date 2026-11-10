<script setup lang="ts">
import { ref } from 'vue'

const date = ref('')
</script>

<template>
  <BiliSpace direction="vertical" :size="12" style="width: 260px">
    <BiliDatePicker v-model="date" placeholder="选择日期" clearable />
    <span class="hint">当前值：{{ date || '空' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
