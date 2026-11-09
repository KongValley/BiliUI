<script setup lang="ts">
import { ref } from 'vue'

const active = ref('home')

const items = [
  { key: 'home', label: '概览', icon: 'home' },
  { key: 'project', label: '项目', icon: 'grid' },
  { key: 'task', label: '任务', icon: 'list' },
  { key: 'chart', label: '报表', icon: 'chart' },
  { key: 'settings', label: '设置', icon: 'settings' }
]
</script>

<template>
  <div class="menu-demo">
    <span class="hint">当前选中：{{ active }}</span>
    <BiliMenu v-model="active" :items="items" />
  </div>
</template>

<style scoped>
.menu-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  background: var(--bili-bg-muted);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
}

.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
