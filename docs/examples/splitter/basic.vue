<script setup lang="ts">
import { ref } from 'vue'

const horizontal = ref(38)
const vertical = ref(55)
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">水平分割 / 可拖拽、双击复位</span>
      <BiliSplitter v-model="horizontal" :height="220">
        <template #start>
          <div class="pane">
            <strong>左侧面板</strong>
            <span>拖动中间分隔条调整宽度，或双击恢复 50%。</span>
          </div>
        </template>
        <template #end>
          <div class="pane pane--alt">
            <strong>右侧面板</strong>
            <span>当前占比 {{ horizontal }}%</span>
          </div>
        </template>
      </BiliSplitter>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">垂直分割</span>
      <BiliSplitter v-model="vertical" direction="vertical" :height="220">
        <template #start>
          <div class="pane">
            <strong>上方面板</strong>
          </div>
        </template>
        <template #end>
          <div class="pane pane--alt">
            <strong>下方面板</strong>
            <span>当前占比 {{ vertical }}%</span>
          </div>
        </template>
      </BiliSplitter>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.pane {
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  height: 100%;
  padding: 16px;
  font-size: 13px;
  color: var(--bili-text-regular);
  background-color: var(--bili-fill-color-lighter);
}

.pane--alt {
  background-color: var(--bili-bg-container);
}
</style>
