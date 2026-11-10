<script setup lang="ts">
import { ref } from 'vue'

const checked = ref<Array<string | number>>(['vue'])

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
      { label: '后端组', value: 'be' },
      { label: '测试组', value: 'qa', disabled: true }
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
  <BiliSpace direction="vertical" size="md" style="width: 400px">
    <BiliTree
      v-model:checked-keys="checked"
      :data="data"
      checkable
      filterable
      default-expand-all
    />
    <span class="hint">
      已选 {{ checked.length }} 项：{{ checked.join(', ') || '无' }}
    </span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
