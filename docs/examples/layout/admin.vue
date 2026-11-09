<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <BiliLayout class="shell" :full-height="false">
    <BiliLayoutHeader :height="56" sticky>
      <div class="brand">
        <BiliIcon name="box" :size="18" color="var(--bili-color-primary)" />
        <strong>Bili Admin</strong>
      </div>
      <BiliSpace>
        <BiliTag type="success" size="sm">v0.1.0</BiliTag>
        <BiliButton size="sm" @click="collapsed = !collapsed">
          {{ collapsed ? '展开侧栏' : '收起侧栏' }}
        </BiliButton>
      </BiliSpace>
    </BiliLayoutHeader>

    <BiliLayout direction="horizontal">
      <BiliLayoutAside :width="200" :collapsed-width="64" :collapsed="collapsed">
        <nav class="nav">
          <a v-for="item in ['概览', '项目', '任务', '设置']" :key="item" class="nav__item">
            <BiliIcon name="grid" :size="16" />
            <span v-if="!collapsed">{{ item }}</span>
          </a>
        </nav>
      </BiliLayoutAside>

      <BiliLayout>
        <BiliLayoutContent :padding="20">
          <BiliCard title="主内容区" :shadow="'never'">
            <p>Header 固定高度，Aside 可折叠，Content 自适应剩余空间。</p>
            <p>当前侧栏宽度：{{ collapsed ? 64 : 200 }}px</p>
          </BiliCard>
        </BiliLayoutContent>
        <BiliLayoutFooter>© 2026 Bili UI</BiliLayoutFooter>
      </BiliLayout>
    </BiliLayout>
  </BiliLayout>
</template>

<style scoped>
.shell {
  border: 1px solid var(--bili-border-color-light);
  border-radius: 10px;
  overflow: hidden;
}

.shell :deep(.bili-layout-header) {
  justify-content: space-between;
  padding: 0 16px;
}

.brand {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 15px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
}

.nav__item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--bili-text-regular);
  white-space: nowrap;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
}

.nav__item:hover {
  color: var(--bili-color-primary);
  background: var(--bili-color-primary-light);
}

p {
  margin: 0 0 6px;
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
