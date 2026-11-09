<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>(null)

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Orange', value: 'orange' },
  { label: 'Strawberry', value: 'strawberry', disabled: true },
  { label: 'Watermelon', value: 'watermelon' }
]
</script>

<template>
  <BiliSpace direction="vertical" size="lg" style="width: 320px">
    <BiliSelect
      v-model="value"
      :options="options"
      filterable
      clearable
      placeholder="搜索并选择水果"
    />
    <BiliSelect
      v-model="value"
      :options="options"
      filterable
      clearable
      size="sm"
      placeholder="小号选择器"
    />
    <BiliSelect :options="[]" placeholder="空数据" />
    <span class="value-text">当前值：{{ value ?? '未选择' }}</span>
  </BiliSpace>
</template>

<style scoped>
.value-text {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
