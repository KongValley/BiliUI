<script setup lang="ts">
import { ref } from 'vue'

const target = ref<Array<string | number>>([])

const data = [
  { key: 'vue', label: 'Vue', level: '框架' },
  { key: 'react', label: 'React', level: '框架' },
  { key: 'vite', label: 'Vite', level: '工具' },
  { key: 'vitest', label: 'Vitest', level: '测试' },
  { key: 'eslint', label: 'ESLint', level: '工具', disabled: true }
]
</script>

<template>
  <BiliTransfer
    v-model="target"
    :data="data"
    filterable
    :titles="['备选技术', '已选技术']"
  >
    <template #item="{ item }">
      <span>{{ item.label }}</span>
      <BiliTag size="sm" effect="plain">{{ item.level }}</BiliTag>
    </template>
  </BiliTransfer>
</template>
