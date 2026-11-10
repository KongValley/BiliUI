<script setup lang="ts">
import { ref } from 'vue'

const date = ref('')
const disabledDate = (date: Date) => date.getDay() === 0 || date.getDay() === 6
</script>

<template>
  <BiliSpace direction="vertical" :size="12" style="width: 260px">
    <BiliDatePicker v-model="date" :disabled-date="disabledDate" placeholder="周末不可选" />
    <span class="hint">disabled-date 返回 true 的日期会置灰且不可点击。</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}
</style>
