<script setup lang="ts">
import { ref } from 'vue'

const active = ref('a1')

const items = Array.from({ length: 10 }, (_, index) => ({
  key: `a${index + 1}`,
  label: `导航项 ${index + 1}`,
  icon: 'grid'
}))
</script>

<template>
  <div class="overflow-demo">
    <span class="hint">
      拖动下方菜单的右下角改变宽度：放不下的项会自动收进「更多」下拉，拉宽后自动还原
    </span>
    <div class="frame">
      <BiliMenu v-model="active" :items="items" />
    </div>
    <span class="hint">当前选中：{{ active }}</span>
  </div>
</template>

<style scoped>
.overflow-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.frame {
  /* Wide enough to show every item on first paint; the user can drag it narrower. */
  width: 100%;
  min-width: 240px;
  max-width: 100%;
  padding: 4px 10px;
  margin-bottom: 8px;
  overflow: hidden;
  resize: horizontal;
  background: var(--bili-bg-muted);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
}

.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
