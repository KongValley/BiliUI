<script setup lang="ts">
import { ref } from 'vue'

const pad = (value: number) => String(value).padStart(2, '0')
const format = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const today = () => format(new Date())
const last7Days = () => {
  const end = new Date()
  const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6)
  return [format(start), format(end)] as [string, string]
}
const thisMonth = () => {
  const now = new Date()
  return [
    format(new Date(now.getFullYear(), now.getMonth(), 1)),
    format(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  ] as [string, string]
}

const range = ref<[string, string] | null>(null)
const shortcuts = [
  { text: '今天', value: today },
  { text: '近 7 天', value: last7Days },
  { text: '本月', value: thisMonth }
]
</script>

<template>
  <BiliSpace direction="vertical" :size="12" style="width: 380px">
    <BiliDatePicker v-model="range" type="daterange" :shortcuts="shortcuts" range-separator="至" />
    <span class="hint">当前区间：{{ range ? range.join(' 至 ') : '空' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
