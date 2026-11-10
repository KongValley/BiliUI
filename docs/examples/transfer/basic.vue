<script setup lang="ts">
import { ref } from 'vue'

const target = ref<Array<string | number>>(['a', 'c'])

const data = [
  { key: 'a', label: 'Alice' },
  { key: 'b', label: 'Bob' },
  { key: 'c', label: 'Carol' },
  { key: 'd', label: 'David' },
  { key: 'e', label: 'Eve' },
  { key: 'f', label: 'Frank' },
  { key: 'g', label: 'Grace', disabled: true }
]
</script>

<template>
  <BiliSpace direction="vertical" size="md" style="width: 100%">
    <BiliTransfer
      v-model="target"
      :data="data"
      :titles="['可选成员', '已选成员']"
    />
    <span class="hint">已选：{{ target.join(', ') || '无' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
