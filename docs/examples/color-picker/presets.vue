<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#1677ff')
const presets = [
  '#e0356b',
  '#fb7299',
  '#ff7a45',
  '#ffc53d',
  '#73d13d',
  '#36cfc9',
  '#1677ff',
  '#597ef7',
  '#9254de',
  '#f759ab',
  '#434343',
  '#f5f5f5'
]
</script>

<template>
  <BiliSpace direction="vertical" size="md" style="width: 260px">
    <BiliColorPicker v-model="color" :presets="presets" clearable />
    <span class="hint">双击触发器外区域关闭面板，预设色可直接点选</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
