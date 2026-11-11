<script setup lang="ts">
import { ref } from 'vue'

const items = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  name: `日志条目 #${index + 1}`
}))
const listRef = ref<{ scrollToIndex: (index: number) => void } | null>(null)
</script>

<template>
  <BiliSpace direction="vertical" size="sm" fill>
    <BiliSpace :size="8" align="center" wrap>
      <BiliButton size="sm" @click="listRef?.scrollToIndex(5000)">跳到第 5001 条</BiliButton>
      <span class="hint">只渲染可视区域内的节点，共 10,000 条</span>
    </BiliSpace>

    <BiliVirtualList
      ref="listRef"
      :data="items"
      :height="280"
      :item-height="36"
      row-key="id"
      class="demo-list"
    >
      <template #default="{ item, index }">
        <span class="index">{{ index + 1 }}</span>
        <span>{{ item.name }}</span>
      </template>
    </BiliVirtualList>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.demo-list {
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

.index {
  width: 56px;
  color: var(--bili-text-placeholder);
  text-align: right;
}
</style>
