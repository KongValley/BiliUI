<script setup lang="ts">
import { ref } from 'vue'

const value = ref<Array<string | number>>(['vue', 'react'])

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
    <BiliTreeSelect
      v-model="value"
      :data="data"
      multiple
      default-expand-all
      clearable
      :max-tag-count="2"
      placeholder="请选择团队"
    />
    <span class="hint">已选 {{ value.length }} 项</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
