<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
const active = ref('home')

const items = [
  { key: 'home', label: '概览', icon: 'home' },
  {
    key: 'project',
    label: '项目管理',
    icon: 'grid',
    children: [
      { key: 'p1', label: '全部项目' },
      { key: 'p2', label: '我的项目' }
    ]
  },
  { key: 'task', label: '任务', icon: 'list' },
  {
    key: 'report',
    label: '报表',
    icon: 'chart',
    children: [
      { key: 'r1', label: '日报' },
      { key: 'r2', label: '月报' }
    ]
  },
  { key: 'settings', label: '设置', icon: 'settings' }
]
</script>

<template>
  <div class="vertical-demo">
    <div class="toolbar">
      <BiliButton size="sm" @click="collapsed = !collapsed">
        {{ collapsed ? '展开菜单' : '收起菜单' }}
      </BiliButton>
      <span class="hint">当前选中：{{ active }}</span>
    </div>

    <div class="rail">
      <BiliMenu
        v-model="active"
        :items="items"
        mode="vertical"
        :collapsed="collapsed"
        :collapsed-width="64"
        :default-opened-keys="['project']"
      />
    </div>
  </div>
</template>

<style scoped>
.vertical-demo {
  display: flex;
  gap: 16px;
  width: 100%;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.rail {
  flex-shrink: 0;
  width: 220px;
  padding: 8px;
  background: var(--bili-bg-muted);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
  transition: width 0.2s var(--bili-transition-function-out);
}

.rail:has(.is-collapsed) {
  width: 84px;
}

.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
