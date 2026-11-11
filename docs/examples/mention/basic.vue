<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const users = [
  { label: '林晞', value: 'linxi' },
  { label: '陈屿', value: 'chenyu' },
  { label: '周野', value: 'zhouye' },
  { label: '苏晚', value: 'suwan', disabled: true }
]
</script>

<template>
  <BiliSpace direction="vertical" size="sm" fill>
    <BiliMention
      v-model="text"
      :options="users"
      :rows="4"
      placeholder="输入 @ 提及成员，例如 @林"
      style="max-width: 420px"
    />
    <span class="hint">当前内容：{{ text || '（空）' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-placeholder);
}
</style>
