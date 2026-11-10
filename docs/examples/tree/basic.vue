<script setup lang="ts">
import { ref } from 'vue'

const current = ref<string | number>('fe')

const data = [
  {
    label: '研发中心',
    value: 'dev',
    children: [
      {
        label: '前端组',
        value: 'fe',
        children: [
          { label: 'Vue 团队', value: 'vue' },
          { label: 'React 团队', value: 'react' }
        ]
      },
      { label: '后端组', value: 'be' }
    ]
  },
  {
    label: '设计中心',
    value: 'design',
    children: [
      { label: '体验设计', value: 'ux' },
      { label: '视觉设计', value: 'visual' }
    ]
  }
]
</script>

<template>
  <BiliSpace direction="vertical" size="md" style="width: 360px">
    <BiliTree v-model="current" :data="data" default-expand-all />
    <span class="hint">当前选中：{{ current }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
