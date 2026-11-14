<script setup lang="ts">
import { computed, ref } from 'vue'
import { BiliMessage } from 'bili-ui'
import HomeMark from './HomeMark.vue'

const activeTab = ref('all')
const search = ref('')
const autoSave = ref(true)
const drafts = [
  {
    id: 1,
    title: '把灵感，变成下一次惊喜',
    description: '用一点色彩，让平凡的日常闪闪发光。',
    date: '今天 10:24',
    status: 'published',
    art: 'flower'
  },
  {
    id: 2,
    title: '关于夏天的一些想象',
    description: '记录流动的时间，也记录那些微小而真实的快乐。',
    date: '昨天 16:08',
    status: 'draft',
    art: 'wave'
  }
]

const filteredDrafts = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return drafts.filter(item => {
    const matchesTab = activeTab.value === 'all' || item.status === activeTab.value
    return matchesTab && `${item.title}${item.description}`.toLowerCase().includes(keyword)
  })
})

const createDraft = () => {
  BiliMessage.success('新草稿已创建，去看看吧')
}
</script>

<template>
  <section class="studio-window" aria-label="可交互的创作工作台">
    <header class="studio-topbar">
      <div class="studio-brand">
        <span class="studio-brand__icon"><span /><span /><span /></span>
        <span>创作中心</span>
        <span class="studio-divider" />
        <span class="studio-breadcrumb">内容管理</span>
      </div>
      <BiliAvatar name="Bili UI" :size="28" class="studio-avatar" />
    </header>

    <div class="studio-body">
      <div class="studio-toolbar">
        <BiliTabs v-model="activeTab" class="studio-tabs">
          <BiliTabPane name="all" label="全部内容" />
          <BiliTabPane name="published" label="已发布" />
          <BiliTabPane name="draft" label="草稿" />
        </BiliTabs>
        <span class="studio-count">{{ filteredDrafts.length }} 个内容</span>
      </div>

      <div class="studio-actions">
        <BiliInput v-model="search" placeholder="搜索内容…" clearable class="studio-search">
          <template #prefix><BiliIcon name="search" /></template>
        </BiliInput>
        <BiliButton type="primary" @click="createDraft">
          <template #icon><BiliIcon name="plus" size="15" /></template>
          新建内容
        </BiliButton>
      </div>

      <TransitionGroup tag="div" name="studio-list" class="studio-contents">
        <article v-for="item in filteredDrafts" :key="item.id" class="studio-item">
          <div class="studio-item__art" :class="`is-${item.art}`" aria-hidden="true">
            <HomeMark v-if="item.art === 'flower'" :compact="true" />
            <svg v-else viewBox="0 0 56 64" fill="none"><path d="M-8 39C6 17 20 58 38 29S65 22 72 33" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M-8 52C6 30 20 71 38 42S65 35 72 46" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>
          </div>
          <div class="studio-item__content">
            <div class="studio-item__title">{{ item.title }}</div>
            <p class="studio-item__description">{{ item.description }}</p>
            <div class="studio-item__meta">
              <BiliTag :type="item.status === 'published' ? 'success' : 'default'" size="sm">{{ item.status === 'published' ? '已发布' : '草稿' }}</BiliTag>
              <span>{{ item.date }}</span>
            </div>
          </div>
          <button class="studio-item__more" type="button" aria-label="更多操作"><BiliIcon name="more" /></button>
        </article>
      </TransitionGroup>

      <div v-if="filteredDrafts.length === 0" class="studio-empty">没有找到匹配的内容，试试其他关键词</div>

      <footer class="studio-footer">
        <span><BiliSwitch v-model="autoSave" size="sm" />自动保存</span>
        <span class="studio-footer__state"><span />{{ autoSave ? '所有更改已保存' : '自动保存已暂停' }}</span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.studio-window {
  --bili-control-font-size: 12px;
  --bili-control-height-md: 32px;
  --bili-control-padding-md: 12px;
  --bili-button-font-size: 12px;
  --bili-input-font-size: 12px;
  position: relative;
  width: 100%;
  overflow: hidden;
  font-size: 12px;
  background: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
  box-shadow: none;
}

.studio-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  padding: 0 22px;
  border-bottom: 1px solid var(--bili-border-color-lighter);
}

.studio-brand {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.studio-brand__icon {
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--bili-color-primary);
  border-radius: 6px;
}

.studio-brand__icon span {
  width: 2px;
  height: 6px;
  background: var(--bili-color-on-primary);
  border-radius: 1px;
  transform: rotate(20deg);
}

.studio-brand__icon span:nth-child(2) {
  height: 10px;
}

.studio-divider {
  width: 1px;
  height: 12px;
  margin: 0 4px;
  background: var(--bili-border-color);
}

.studio-breadcrumb {
  font-size: 11px;
  font-weight: 400;
  color: var(--bili-text-secondary);
}

.studio-avatar {
  font-size: 11px;
  background: #efe4fa;
}

.studio-body {
  padding: 0 24px;
}

.studio-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  border-bottom: 1px solid var(--bili-border-color-lighter);
}

.studio-tabs {
  width: auto;
  --bili-tabs-height: 40px;
  --bili-tabs-gap: 24px;
  --bili-tabs-font-size: 12px;
  --bili-tabs-content-padding: 0;
}

.studio-tabs :deep(.bili-tabs__nav) {
  border: 0;
}

.studio-tabs :deep(.bili-tabs__content),
.studio-tabs :deep(.bili-tab-pane) {
  display: none;
}

.studio-tabs :deep(.bili-tabs__tab.is-active) {
  font-weight: 500;
}

.studio-count {
  font-size: 10px;
  color: var(--bili-text-placeholder);
}

.studio-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 12px;
}

.studio-search {
  width: 190px;
  background: var(--bili-fill-color-lighter);
  border-color: transparent;
}

.studio-contents {
  min-height: 162px;
}

.studio-item {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--bili-border-color-lighter);
}

.studio-item__art {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 64px;
  overflow: hidden;
  color: #b6b2d8;
  background: #f4f0f6;
  border-radius: 8px;
}

.studio-item__art.is-wave {
  color: #9bc6cc;
  background: #eef6f5;
}

.studio-item__content {
  min-width: 0;
}

.studio-item__title {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  color: var(--bili-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.studio-item__description {
  max-width: 270px;
  margin: 4px 0 9px;
  overflow: hidden;
  font-size: 11px;
  color: var(--bili-text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.studio-item__meta {
  display: flex;
  gap: 9px;
  align-items: center;
  font-size: 10px;
  color: var(--bili-text-placeholder);
}

.studio-item__meta :deep(.bili-tag) {
  height: 18px;
  padding: 0 5px;
  font-size: 10px;
  border: 0;
  border-radius: 4px;
}

.studio-item__more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  margin-left: auto;
  color: var(--bili-text-placeholder);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 5px;
}

.studio-item__more:hover {
  color: var(--bili-text-primary);
  background: var(--bili-fill-color-light);
}

.studio-empty {
  display: grid;
  min-height: 162px;
  place-items: center;
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.studio-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 0 19px;
  font-size: 10px;
  color: var(--bili-text-secondary);
}

.studio-footer > span {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.studio-footer__state > span {
  width: 4px;
  height: 4px;
  background: var(--bili-color-success);
  border-radius: 50%;
}

.studio-list-enter-active {
  transition: all var(--bili-transition-duration-slow) var(--bili-transition-function-out);
}

.studio-list-leave-active {
  display: none;
}

.studio-list-enter-from {
  opacity: 0;
  transform: translateY(4px);
}


@media (max-width: 640px) {
  .studio-topbar {
    padding: 0 16px;
  }

  .studio-body {
    padding: 0 16px;
  }

  .studio-item {
    gap: 12px;
  }

  .studio-item__description {
    max-width: 170px;
  }

  .studio-count {
    display: none;
  }
}

@media (max-width: 390px) {
  .studio-search {
    width: 152px;
  }

  .studio-footer__state {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .studio-list-enter-active {
    transition: none;
  }
}
</style>
