<script setup lang="ts">
import { ref } from 'vue'

const active = ref('p1')

const items = [
  { key: 'home', label: '概览', icon: 'home' },
  {
    key: 'project',
    label: '项目管理',
    icon: 'grid',
    children: [
      { key: 'p1', label: '全部项目' },
      { key: 'p2', label: '我的项目' },
      { key: 'p3', label: '已归档', disabled: true }
    ]
  },
  {
    key: 'report',
    label: '报表中心',
    icon: 'chart',
    children: [
      { key: 'r1', label: '日报' },
      { key: 'r2', label: '周报' }
    ]
  },
  { key: 'settings', label: '设置', icon: 'settings' }
]
</script>

<template>
  <div class="menu-demo">
    <span class="hint">横向二级菜单：悬停或点击父项展开下拉</span>
    <BiliMenu v-model="active" :items="items" mode="horizontal" />
    <span class="hint">当前选中：{{ active }}</span>
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
