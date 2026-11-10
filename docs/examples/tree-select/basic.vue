<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | number | null>('fe')

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
    children: [{ label: '视觉设计', value: 'visual' }]
  }
]
</script>

<template>
  <BiliSpace direction="vertical" size="md" style="width: 320px">
    <BiliTreeSelect
      v-model="value"
      :data="data"
      default-expand-all
      clearable
      placeholder="请选择组织"
    />
    <span class="hint">当前值：{{ value }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
