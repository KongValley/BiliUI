<script setup lang="ts">
import { ref } from 'vue'

const scroller = ref<HTMLElement | null>(null)
const lines = Array.from(
  { length: 14 },
  (_, index) => `自定义插槽示例 · 第 ${index + 1} 行，按钮内容由插槽决定。`
)
</script>

<template>
  <div class="back-top-demo">
    <div ref="scroller" class="scroller">
      <p v-for="line in lines" :key="line">{{ line }}</p>
    </div>
    <BiliBackTop
      :target="scroller"
      :visibility-height="60"
      :right="24"
      :bottom="24"
      :duration="600"
    >
      <span class="custom-label">TOP</span>
    </BiliBackTop>
  </div>
</template>

<style scoped>
.back-top-demo {
  position: relative;
}

.scroller {
  height: 220px;
  padding: 16px 20px;
  overflow-y: auto;
  background-color: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

p {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}

.custom-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
