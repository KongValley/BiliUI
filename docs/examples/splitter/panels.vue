<script setup lang="ts">
import { ref } from 'vue'

const sizes = ref<number[]>([30, 40, 30])
</script>

<template>
  <BiliSplitter v-model:sizes="sizes" :height="220">
    <BiliSplitterPanel :size="30" class="pane">
      <strong>导航</strong>
      <p>30%</p>
    </BiliSplitterPanel>
    <BiliSplitterPanel :size="40" collapsible class="pane pane--main">
      <strong>主区域</strong>
      <p>40%，双击右侧分隔条可折叠</p>
    </BiliSplitterPanel>
    <BiliSplitterPanel :size="30" class="pane">
      <strong>属性</strong>
      <p>30%</p>
    </BiliSplitterPanel>
  </BiliSplitter>
</template>

<style scoped>
.pane {
  padding: 16px;
  font-size: 13px;
  color: var(--bili-text-regular);
  background: var(--bili-bg-color);
}

.pane--main {
  background: var(--bili-fill-color);
}

.pane p {
  margin: 6px 0 0;
  color: var(--bili-text-secondary);
}
</style>
