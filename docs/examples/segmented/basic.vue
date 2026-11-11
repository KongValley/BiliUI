<script setup lang="ts">
import { ref } from 'vue'

const period = ref('week')
const view = ref('list')
const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' }
]
const viewOptions = [
  { label: '列表', value: 'list', icon: 'list' },
  { label: '网格', value: 'grid', icon: 'grid' },
  { label: '看板', value: 'board', icon: 'layout' }
]
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">基础用法</span>
      <BiliSegmented v-model="period" :options="options" />
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">带图标 / 尺寸</span>
      <BiliSpace :size="12" align="center" wrap>
        <BiliSegmented v-model="view" :options="viewOptions" />
        <BiliSegmented v-model="period" :options="options" size="sm" />
        <BiliSegmented v-model="period" :options="options" size="lg" />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">撑满容器 / 禁用</span>
      <BiliSegmented v-model="period" :options="options" block />
      <BiliSegmented v-model="period" :options="options" block disabled />
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
