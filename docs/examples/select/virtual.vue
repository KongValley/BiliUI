<script setup lang="ts">
import { ref } from 'vue'

const options = Array.from({ length: 500 }, (_, index) => ({
  label: `选项 ${index + 1}`,
  value: index + 1
}))

const value = ref<string | number | null>(null)
</script>

<template>
  <BiliSelect
    v-model="value"
    :options="options"
    filterable
    clearable
    placeholder="500 条选项，自动开启虚拟滚动"
    style="width: 320px"
  />
</template>
