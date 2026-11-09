<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
const fullscreen = ref(false)

const reload = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1500)
}

const showFullscreen = () => {
  fullscreen.value = true
  setTimeout(() => {
    fullscreen.value = false
  }, 1500)
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace wrap>
      <BiliButton type="primary" @click="reload">重新加载（1.5s）</BiliButton>
      <BiliButton @click="showFullscreen">全屏加载</BiliButton>
    </BiliSpace>

    <div v-loading="loading" class="loading-panel">
      <p>点击按钮触发局部加载，内容区域会被遮罩覆盖。</p>
    </div>

    <BiliLoading v-if="fullscreen" fullscreen text="正在加载全局数据..." />
  </BiliSpace>
</template>

<style scoped>
.loading-panel {
  min-height: 140px;
  padding: 24px;
  background: var(--bili-bg-muted);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
}

.loading-panel p {
  margin: 0;
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
