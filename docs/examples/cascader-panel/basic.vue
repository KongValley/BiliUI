<script setup lang="ts">
import { ref } from 'vue'

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' }
    ]
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      { value: 'nanjing', label: '南京' },
      { value: 'suzhou', label: '苏州' }
    ]
  },
  { value: 'shanghai', label: '上海' }
]

const value = ref<string | number | null>('suzhou')
const selectable = ref<string | number | null>(null)
</script>

<template>
  <BiliSpace :size="24" align="start" wrap>
    <BiliSpace direction="vertical" size="sm">
      <span class="label">面板选择</span>
      <BiliCascaderPanel v-model="value" :options="options" />
      <span class="hint">当前值：{{ value ?? '未选择' }}</span>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">父级可选</span>
      <BiliCascaderPanel v-model="selectable" :options="options" change-on-select />
      <span class="hint">当前值：{{ selectable ?? '未选择' }}</span>
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
