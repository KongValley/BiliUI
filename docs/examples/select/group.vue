<script setup lang="ts">
import { ref } from 'vue'

const options = [
  {
    label: '前端',
    options: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Angular', value: 'angular' }
    ]
  },
  {
    label: '后端',
    options: [
      { label: 'Node.js', value: 'node' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' }
    ]
  }
]

const value = ref<string | number | null>('vue')
</script>

<template>
  <BiliSelect
    v-model="value"
    :options="options"
    clearable
    placeholder="请选择技术栈"
    style="width: 320px"
  />
</template>
