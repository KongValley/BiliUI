<script setup lang="ts">
import { ref } from 'vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig', disabled: true }
]

const value = ref<Array<string | number>>(['apple', 'banana'])
</script>

<template>
  <BiliSpace direction="vertical" size="lg" style="width: 380px">
    <BiliSelect
      v-model="value"
      :options="options"
      multiple
      clearable
      select-all
      :max-tag-count="2"
      placeholder="请选择水果"
    />
    <span class="hint">当前值：{{ value.join(', ') || '空' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
