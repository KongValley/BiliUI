<script setup lang="ts">
import { ref } from 'vue'

const month = ref('2026-11')
const year = ref('2026')
const datetime = ref('2026-11-11 20:30:00')
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliSpace :size="16" align="center" wrap>
      <BiliSpace direction="vertical" size="sm">
        <span class="label">月选择</span>
        <BiliDatePicker v-model="month" type="month" style="width: 200px" />
      </BiliSpace>

      <BiliSpace direction="vertical" size="sm">
        <span class="label">年选择</span>
        <BiliDatePicker v-model="year" type="year" style="width: 200px" />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">日期时间</span>
      <BiliDatePicker v-model="datetime" type="datetime" style="width: 260px" />
      <span class="hint">绑定值：{{ datetime }}</span>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.hint {
  font-size: 12px;
  color: var(--bili-text-placeholder);
}
</style>
