<script setup lang="ts">
import { computed, ref } from 'vue'
import { BiliMessage } from '@kongvalley/bili-ui'

type ViewMode = 'overview' | 'orders'

const view = ref<ViewMode>('overview')
const keyword = ref('')
const density = ref<'comfortable' | 'compact'>('comfortable')
const loading = ref(false)
const activeNav = ref('概览')
const noticePanel = ref(false)
const filterPanel = ref(false)

const navItems = [
  { label: '概览', icon: 'home' },
  { label: '订单', icon: 'list' },
  { label: '客户', icon: 'users' },
  { label: '洞察', icon: 'chart' }
]

const orders = [
  { id: '#8421', customer: '林青', item: 'Pro 年度方案', amount: '¥8,400', state: '已支付' },
  { id: '#8418', customer: '陈默', item: '团队席位 × 12', amount: '¥5,760', state: '已支付' },
  { id: '#8412', customer: '苏晚', item: 'Design Pro', amount: '¥2,388', state: '处理中' },
  { id: '#8406', customer: '周屿', item: '团队席位 × 30', amount: '¥12,800', state: '已支付' }
]

const filteredOrders = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return orders
  return orders.filter(order =>
    `${order.customer}${order.item}${order.id}`.toLowerCase().includes(query)
  )
})

const revenue = [
  { name: '收入', data: [18, 22, 21, 30, 28, 36, 41], area: true, smooth: true },
  { name: '目标', data: [20, 23, 26, 30, 33, 37, 40], smooth: true }
]

const createOrder = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    BiliMessage.success('新订单草稿已创建')
  }, 480)
}

const handleNav = (label: string) => {
  activeNav.value = label
  if (label === '概览') view.value = 'overview'
  else if (label === '订单') view.value = 'orders'
  else BiliMessage.info(`${label}页面将在完整业务示例中展示`)
}
</script>

<template>
  <section class="preview-shell" aria-label="Bili UI 仪表盘组件预览">
    <div class="preview-window">
      <aside class="preview-sidebar">
        <div class="preview-brand">
          <span class="preview-brand__mark">B</span>
          <div>
            <strong>Northstar</strong>
            <span>WORKSPACE</span>
          </div>
        </div>

        <div class="preview-workspace">
          <span class="preview-workspace__avatar">NS</span>
          <div>
            <strong>Northstar Labs</strong>
            <span>专业版</span>
          </div>
          <span class="preview-workspace__chevron">⌄</span>
        </div>

        <nav class="preview-nav" aria-label="预览导航">
          <button
            v-for="item in navItems"
            :key="item.label"
            type="button"
            class="preview-nav__item"
            :class="{ 'is-active': activeNav === item.label }"
            @click="handleNav(item.label)"
          >
            <span class="preview-nav__icon" aria-hidden="true">{{
              item.icon === 'home'
                ? '⌂'
                : item.icon === 'list'
                  ? '☷'
                  : item.icon === 'users'
                    ? '♙'
                    : '◔'
            }}</span>
            <span>{{ item.label }}</span>
            <span v-if="item.label === '订单'" class="preview-nav__count">4</span>
          </button>
        </nav>

        <div class="preview-sidebar__foot">
          <button type="button" class="preview-nav__item">
            <span class="preview-nav__icon">⚙</span>
            <span>设置</span>
          </button>
          <div class="preview-user">
            <BiliAvatar name="Ming Chen" :size="28" />
            <div>
              <strong>Ming Chen</strong>
              <span>管理员</span>
            </div>
          </div>
        </div>
      </aside>

      <div class="preview-main">
        <header class="preview-header">
          <div class="preview-heading">
            <span class="preview-kicker">工作区 / 概览</span>
            <h2>早上好，Ming</h2>
            <p>这是你团队本周的业务脉搏。</p>
          </div>
          <div class="preview-header__actions">
            <button
              type="button"
              class="preview-icon-button"
              aria-label="通知"
              :aria-expanded="noticePanel"
              @click="noticePanel = !noticePanel"
            >
              <BiliIcon name="bell" :size="15" />
              <span class="preview-notification-dot" />
            </button>
            <BiliButton size="sm" type="primary" :loading="loading" @click="createOrder">
              <template #icon><BiliIcon name="plus" :size="14" /></template>
              新建订单
            </BiliButton>
          </div>
        </header>

        <div class="preview-toolbar">
          <BiliSegmented
            v-model="view"
            :options="[
              { label: '概览', value: 'overview' },
              { label: '订单', value: 'orders' }
            ]"
            size="sm"
          />
          <div class="preview-toolbar__right">
            <BiliInput
              v-model="keyword"
              size="sm"
              placeholder="搜索订单…"
              clearable
              class="preview-search"
            >
              <template #prefix><BiliIcon name="search" :size="13" /></template>
            </BiliInput>
            <div class="preview-toolbar-popover-anchor">
              <button
                type="button"
                class="preview-icon-button preview-icon-button--bordered"
                aria-label="筛选"
                :aria-expanded="filterPanel"
                @click="filterPanel = !filterPanel"
              >
                <BiliIcon name="filter" :size="14" />
              </button>
              <div v-if="filterPanel" class="preview-popover">
                <span>排序方式</span>
                <BiliSegmented
                  v-model="density"
                  :options="[
                    { label: '舒适', value: 'comfortable' },
                    { label: '紧凑', value: 'compact' }
                  ]"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="noticePanel" class="preview-notice">
          <div>
            <strong>2 条新通知</strong>
            <span>林青完成了季度目标复盘 · 5 分钟前</span>
          </div>
          <button type="button" aria-label="关闭通知" @click="noticePanel = false">×</button>
        </div>

        <Transition name="preview-fade" mode="out-in">
          <div v-if="view === 'overview'" key="overview" class="preview-content">
            <div class="preview-stats">
              <article class="preview-stat">
                <div class="preview-stat__top">
                  <span>总收入</span>
                  <BiliTag type="success" size="sm">+18.2%</BiliTag>
                </div>
                <strong>¥128,420</strong>
                <div class="preview-stat__spark">
                  <span
                    v-for="height in [40, 52, 45, 66, 58, 77, 88, 72, 94]"
                    :key="height"
                    :style="{ height: `${height}%` }"
                  />
                </div>
              </article>
              <article class="preview-stat">
                <div class="preview-stat__top">
                  <span>活跃客户</span>
                  <span class="preview-stat__note">本月</span>
                </div>
                <strong>2,846</strong>
                <div class="preview-stat__bottom">
                  <span class="preview-progress"><span style="width: 72%" /></span>
                  <span>72% 目标</span>
                </div>
              </article>
              <article class="preview-stat preview-stat--dark">
                <div class="preview-stat__top">
                  <span>转化率</span>
                  <span class="preview-stat__dot" />
                </div>
                <strong>8.42%</strong>
                <span class="preview-stat__note">较上月提升 1.4%</span>
              </article>
            </div>

            <div class="preview-grid">
              <article class="preview-panel preview-panel--chart">
                <header class="preview-panel__head">
                  <div>
                    <h3>收入趋势</h3>
                    <p>近 7 天与目标对比</p>
                  </div>
                  <span class="preview-panel__meta">实时</span>
                </header>
                <BiliLineChart
                  :categories="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
                  :series="revenue"
                  :height="152"
                  :show-legend="false"
                  :show-grid="true"
                  :value-formatter="value => `${value}k`"
                />
              </article>

              <article class="preview-panel">
                <header class="preview-panel__head">
                  <div>
                    <h3>团队状态</h3>
                    <p>5 人在线</p>
                  </div>
                  <span class="preview-live-dot" />
                </header>
                <div class="preview-team">
                  <BiliAvatarGroup :max="4" :size="30">
                    <BiliAvatar name="林青" />
                    <BiliAvatar name="陈默" />
                    <BiliAvatar name="苏晚" />
                    <BiliAvatar name="周屿" />
                    <BiliAvatar name="Ming Chen" />
                  </BiliAvatarGroup>
                  <span class="preview-team__label">本周协作 28 次</span>
                </div>
                <div class="preview-progress-panel">
                  <div class="preview-progress-panel__head">
                    <span>季度目标</span>
                    <strong>76%</strong>
                  </div>
                  <BiliProgress :percentage="76" :show-text="false" :stroke-width="5" />
                </div>
              </article>
            </div>

            <article class="preview-panel preview-panel--table">
              <header class="preview-panel__head">
                <div>
                  <h3>最新订单</h3>
                  <p>今天有 4 笔新交易</p>
                </div>
                <button type="button" class="preview-link" @click="view = 'orders'">
                  查看全部 →
                </button>
              </header>
              <div class="preview-order-list">
                <div v-for="order in orders.slice(0, 3)" :key="order.id" class="preview-order">
                  <BiliAvatar :name="order.customer" :size="26" />
                  <div class="preview-order__main">
                    <strong>{{ order.customer }}</strong>
                    <span>{{ order.item }}</span>
                  </div>
                  <span class="preview-order__id">{{ order.id }}</span>
                  <strong class="preview-order__amount">{{ order.amount }}</strong>
                  <BiliTag :type="order.state === '已支付' ? 'success' : 'warning'" size="sm">
                    {{ order.state }}
                  </BiliTag>
                </div>
              </div>
            </article>
          </div>

          <div v-else key="orders" class="preview-content">
            <div class="preview-order-page">
              <div class="preview-order-page__head">
                <div>
                  <h3>全部订单</h3>
                  <p>{{ filteredOrders.length }} 条记录</p>
                </div>
                <BiliSegmented
                  v-model="density"
                  :options="[
                    { label: '舒适', value: 'comfortable' },
                    { label: '紧凑', value: 'compact' }
                  ]"
                  size="sm"
                />
              </div>
              <div class="preview-order-table">
                <div class="preview-order-table__head">
                  <span>客户</span><span>订单</span><span>金额</span><span>状态</span>
                </div>
                <div
                  v-for="order in filteredOrders"
                  :key="order.id"
                  class="preview-order-table__row"
                  :class="{ 'is-compact': density === 'compact' }"
                >
                  <span class="preview-order-table__customer">
                    <BiliAvatar :name="order.customer" :size="24" />
                    {{ order.customer }}
                  </span>
                  <span>{{ order.item }}</span>
                  <strong>{{ order.amount }}</strong>
                  <BiliTag :type="order.state === '已支付' ? 'success' : 'warning'" size="sm">
                    {{ order.state }}
                  </BiliTag>
                </div>
                <div v-if="filteredOrders.length === 0" class="preview-order-empty">
                  没有匹配的订单
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <div class="preview-caption">
          <span><span class="preview-caption__dot" />所有组件均来自 Bili UI</span>
          <span>Vue 3 · TypeScript · 0 runtime deps</span>
        </div>
      </div>
    </div>

    <div class="preview-float-card" aria-hidden="true">
      <span class="preview-float-card__icon"><BiliIcon name="check" :size="13" /></span>
      <div>
        <strong>主题已同步</strong>
        <span>Light / Dark tokens</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview-shell {
  position: relative;
  width: 100%;
  max-width: 720px;
  padding: 10px 0 18px;
}

.preview-window {
  display: flex;
  width: 100%;
  min-height: 474px;
  overflow: hidden;
  font-size: 11px;
  background: var(--bili-bg-page);
  border: 1px solid var(--bili-border-color);
  border-radius: 10px;
}

.preview-sidebar {
  display: flex;
  flex: 0 0 144px;
  flex-direction: column;
  padding: 18px 12px 12px;
  background: var(--bili-bg-container);
  border-right: 1px solid var(--bili-border-color-light);
}

.preview-brand {
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 0 4px;
}

.preview-brand__mark {
  display: grid;
  width: 24px;
  height: 24px;
  font-family: var(--bili-font-family-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--bili-color-on-primary);
  background: var(--bili-color-primary);
  border-radius: 6px;
  place-items: center;
}

.preview-brand div,
.preview-workspace div,
.preview-user div {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.preview-brand strong {
  font-size: 11px;
  font-weight: 600;
  color: var(--bili-text-primary);
}

.preview-brand span:not(.preview-brand__mark) {
  font-family: var(--bili-font-family-mono);
  font-size: 6px;
  letter-spacing: 0.13em;
  color: var(--bili-text-placeholder);
}

.preview-workspace {
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 9px 7px;
  margin-top: 18px;
  background: var(--bili-fill-color-lighter);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 6px;
}

.preview-workspace__avatar {
  display: grid;
  flex: none;
  width: 21px;
  height: 21px;
  font-family: var(--bili-font-family-mono);
  font-size: 7px;
  font-weight: 600;
  color: var(--bili-color-primary);
  background: var(--bili-color-primary-light);
  border-radius: 5px;
  place-items: center;
}

.preview-workspace strong {
  overflow: hidden;
  font-size: 8px;
  font-weight: 500;
  color: var(--bili-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-workspace span:not(.preview-workspace__avatar, .preview-workspace__chevron) {
  font-size: 7px;
  color: var(--bili-text-placeholder);
}

.preview-workspace__chevron {
  margin-left: auto;
  color: var(--bili-text-secondary);
}

.preview-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 20px;
}

.preview-nav__item {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  height: 29px;
  padding: 0 8px;
  font-size: 9px;
  color: var(--bili-text-regular);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 5px;
}

.preview-nav__item:hover {
  color: var(--bili-text-primary);
  background: var(--bili-fill-color-lighter);
}

.preview-nav__item.is-active {
  font-weight: 500;
  color: var(--bili-color-primary);
  background: var(--bili-color-primary-light);
}

.preview-nav__icon {
  width: 12px;
  font-size: 13px;
  line-height: 1;
  text-align: center;
}

.preview-nav__count {
  height: 15px;
  padding: 0 4px;
  margin-left: auto;
  font-family: var(--bili-font-family-mono);
  font-size: 8px;
  line-height: 15px;
  color: var(--bili-text-secondary);
  background: var(--bili-fill-color);
  border-radius: 4px;
}

.preview-sidebar__foot {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
  margin-top: auto;
  border-top: 1px solid var(--bili-border-color-lighter);
}

.preview-user {
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 2px 4px;
}

.preview-user strong {
  overflow: hidden;
  font-size: 8px;
  font-weight: 500;
  color: var(--bili-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-user span {
  font-size: 7px;
  color: var(--bili-text-placeholder);
}

.preview-main {
  flex: 1;
  min-width: 0;
  padding: 18px 20px 12px;
}

.preview-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.preview-kicker {
  font-family: var(--bili-font-family-mono);
  font-size: 7px;
  letter-spacing: 0.035em;
  color: var(--bili-text-placeholder);
}

.preview-heading h2 {
  margin: 5px 0 0;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.035em;
  color: var(--bili-text-primary);
}

.preview-heading p {
  margin: 3px 0 0;
  font-size: 8px;
  color: var(--bili-text-secondary);
}

.preview-header__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.preview-icon-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: var(--bili-text-regular);
  cursor: pointer;
  background: var(--bili-bg-container);
  border: 1px solid transparent;
  border-radius: 5px;
}

.preview-icon-button:hover {
  color: var(--bili-text-primary);
  background: var(--bili-fill-color-lighter);
}

.preview-icon-button--bordered {
  border-color: var(--bili-border-color-light);
}

.preview-notification-dot {
  position: absolute;
  top: 6px;
  right: 7px;
  width: 4px;
  height: 4px;
  background: var(--bili-color-primary);
  border: 1px solid var(--bili-bg-container);
  border-radius: 50%;
}

.preview-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0 12px;
  margin-top: 13px;
  border-top: 1px solid var(--bili-border-color-light);
}

.preview-toolbar :deep(.bili-segmented) {
  padding: 2px;
  font-size: 8px;
  background: var(--bili-fill-color-lighter);
  border: 1px solid var(--bili-border-color-light);
}

.preview-toolbar :deep(.bili-segmented__item) {
  min-width: 42px;
  height: 22px;
  font-size: 8px;
}

.preview-toolbar__right {
  display: flex;
  gap: 6px;
  align-items: center;
}

.preview-toolbar-popover-anchor {
  position: relative;
}

.preview-popover {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 5;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px;
  white-space: nowrap;
  background: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color);
  border-radius: 6px;
}

.preview-popover > span {
  padding-left: 3px;
  font-size: 8px;
  color: var(--bili-text-secondary);
}

.preview-search {
  width: 148px;
}

.preview-search :deep(.bili-input__wrapper) {
  height: 28px;
  font-size: 8px;
  background: var(--bili-bg-container);
}

.preview-toolbar :deep(.bili-button) {
  height: 29px;
  padding: 0 10px;
  font-size: 9px;
  border-radius: 5px;
}

.preview-notice {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  margin-top: 8px;
  font-size: 8px;
  background: var(--bili-color-primary-light);
  border: 1px solid
    color-mix(in srgb, var(--bili-color-primary) 20%, var(--bili-border-color-light));
  border-radius: 6px;
}

.preview-notice div {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 8px;
  align-items: baseline;
}

.preview-notice strong {
  font-weight: 500;
  color: var(--bili-text-primary);
}

.preview-notice span {
  color: var(--bili-text-secondary);
}

.preview-notice button {
  flex: none;
  padding: 0 2px;
  font-size: 14px;
  line-height: 1;
  color: var(--bili-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
}

.preview-content {
  min-height: 302px;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.preview-stat {
  display: flex;
  flex-direction: column;
  min-height: 82px;
  padding: 11px;
  background: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 7px;
}

.preview-stat__top {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
  font-size: 8px;
  color: var(--bili-text-secondary);
}

.preview-stat__top :deep(.bili-tag) {
  height: 15px;
  padding: 0 4px;
  font-size: 7px;
  line-height: 15px;
  border: 0;
  border-radius: 3px;
}

.preview-stat strong {
  margin-top: 7px;
  font-family: var(--bili-font-family-mono);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--bili-text-primary);
  letter-spacing: -0.045em;
}

.preview-stat__note {
  font-size: 7px;
  color: var(--bili-text-placeholder);
}

.preview-stat__spark {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 18px;
  margin-top: auto;
}

.preview-stat__spark span {
  flex: 1;
  min-width: 0;
  background: var(--bili-color-primary-light);
  border-radius: 1px;
}

.preview-stat__spark span:nth-last-child(-n + 2) {
  background: var(--bili-color-primary);
}

.preview-stat__bottom {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: auto;
  font-size: 7px;
  color: var(--bili-text-placeholder);
}

.preview-progress {
  flex: 1;
  height: 4px;
  overflow: hidden;
  background: var(--bili-fill-color);
  border-radius: 99px;
}

.preview-progress > span {
  display: block;
  height: 100%;
  background: var(--bili-color-success);
  border-radius: inherit;
}

.preview-stat--dark {
  color: var(--bili-color-on-primary);
  background: var(--bili-color-black);
  border-color: var(--bili-color-black);
}

.preview-stat--dark .preview-stat__top,
.preview-stat--dark .preview-stat__note {
  color: rgb(255 255 255 / 64%);
}

.preview-stat--dark strong {
  color: var(--bili-color-on-primary);
}

.preview-stat__dot {
  width: 5px;
  height: 5px;
  background: var(--bili-color-success);
  border-radius: 50%;
}

.preview-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.preview-panel {
  min-width: 0;
  padding: 11px;
  background: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 7px;
}

.preview-panel--chart {
  overflow: hidden;
}

.preview-panel__head {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 5px;
}

.preview-panel__head h3 {
  margin: 0;
  font-size: 9px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--bili-text-primary);
}

.preview-panel__head p {
  margin: 2px 0 0;
  font-size: 7px;
  color: var(--bili-text-placeholder);
}

.preview-panel__meta {
  font-family: var(--bili-font-family-mono);
  font-size: 6px;
  color: var(--bili-color-success);
}

.preview-panel--chart :deep(.bili-chart) {
  height: 152px;
}

.preview-panel--chart :deep(.bili-chart__canvas) {
  height: 152px !important;
}

.preview-panel--chart :deep(.bili-chart__axis-label) {
  font-size: 6px;
}

.preview-live-dot {
  width: 5px;
  height: 5px;
  margin-top: 3px;
  background: var(--bili-color-success);
  border-radius: 50%;
}

.preview-team {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 0;
  margin-top: 5px;
  border-top: 1px solid var(--bili-border-color-lighter);
  border-bottom: 1px solid var(--bili-border-color-lighter);
}

.preview-team :deep(.bili-avatar) {
  font-size: 8px;
}

.preview-team__label {
  font-size: 7px;
  line-height: 1.5;
  color: var(--bili-text-placeholder);
}

.preview-progress-panel {
  padding-top: 11px;
}

.preview-progress-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
  font-size: 8px;
  color: var(--bili-text-secondary);
}

.preview-progress-panel__head strong {
  font-family: var(--bili-font-family-mono);
  font-size: 9px;
  font-weight: 600;
  color: var(--bili-text-primary);
}

.preview-progress-panel :deep(.bili-progress__bar) {
  height: 5px;
}

.preview-panel--table {
  padding-bottom: 4px;
  margin-top: 8px;
}

.preview-link {
  padding: 0;
  font-size: 7px;
  color: var(--bili-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
}

.preview-link:hover {
  color: var(--bili-color-primary);
}

.preview-order-list {
  margin-top: 3px;
}

.preview-order {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 34px;
  border-top: 1px solid var(--bili-border-color-lighter);
}

.preview-order__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.preview-order__main strong {
  font-size: 8px;
  font-weight: 500;
  color: var(--bili-text-primary);
}

.preview-order__main span,
.preview-order__id {
  overflow: hidden;
  font-size: 7px;
  color: var(--bili-text-placeholder);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-order__id {
  width: 38px;
  font-family: var(--bili-font-family-mono);
}

.preview-order__amount {
  width: 47px;
  font-family: var(--bili-font-family-mono);
  font-size: 8px;
  font-weight: 500;
  color: var(--bili-text-primary);
  text-align: right;
}

.preview-order :deep(.bili-tag) {
  width: 35px;
  height: 16px;
  padding: 0;
  font-size: 7px;
  line-height: 16px;
  text-align: center;
  border: 0;
  border-radius: 3px;
}

.preview-order-page__head {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 12px;
}

.preview-order-page__head h3 {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--bili-text-primary);
}

.preview-order-page__head p {
  margin: 3px 0 0;
  font-size: 8px;
  color: var(--bili-text-placeholder);
}

.preview-order-page :deep(.bili-segmented) {
  padding: 2px;
  background: var(--bili-fill-color-lighter);
  border: 1px solid var(--bili-border-color-light);
}

.preview-order-page :deep(.bili-segmented__item) {
  min-width: 38px;
  height: 22px;
  font-size: 8px;
}

.preview-order-table {
  overflow: hidden;
  background: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 7px;
}

.preview-order-table__head,
.preview-order-table__row {
  display: grid;
  grid-template-columns: minmax(74px, 1.1fr) minmax(92px, 1.35fr) minmax(54px, 0.7fr) minmax(
      48px,
      0.65fr
    );
  gap: 8px;
  align-items: center;
  padding: 0 11px;
}

.preview-order-table__head {
  height: 27px;
  font-size: 7px;
  color: var(--bili-text-placeholder);
  background: var(--bili-fill-color-lighter);
  border-bottom: 1px solid var(--bili-border-color-light);
}

.preview-order-table__row {
  min-height: 38px;
  font-size: 8px;
  color: var(--bili-text-regular);
  border-bottom: 1px solid var(--bili-border-color-lighter);
  transition: background-color var(--bili-transition-duration);
}

.preview-order-table__row:last-child {
  border-bottom: 0;
}

.preview-order-table__row:hover {
  background: var(--bili-fill-color-lighter);
}

.preview-order-table__row.is-compact {
  min-height: 29px;
}

.preview-order-table__customer {
  display: flex;
  gap: 6px;
  align-items: center;
  min-width: 0;
  font-weight: 500;
  color: var(--bili-text-primary);
  white-space: nowrap;
}

.preview-order-table__row strong {
  font-family: var(--bili-font-family-mono);
  font-size: 8px;
  font-weight: 500;
  color: var(--bili-text-primary);
}

.preview-order-table__row :deep(.bili-tag) {
  width: fit-content;
  height: 17px;
  padding: 0 4px;
  font-size: 7px;
  line-height: 17px;
  border: 0;
  border-radius: 3px;
}

.preview-order-empty {
  display: grid;
  min-height: 118px;
  font-size: 9px;
  color: var(--bili-text-placeholder);
  place-items: center;
}

.preview-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 12px;
  font-family: var(--bili-font-family-mono);
  font-size: 7px;
  color: var(--bili-text-placeholder);
  border-top: 1px solid var(--bili-border-color-light);
}

.preview-caption > span {
  display: inline-flex;
  gap: 5px;
  align-items: center;
}

.preview-caption__dot {
  width: 4px;
  height: 4px;
  background: var(--bili-color-success);
  border-radius: 50%;
}

.preview-float-card {
  position: absolute;
  right: -20px;
  bottom: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 148px;
  padding: 9px 11px;
  background: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color);
  border-radius: 7px;
}

.preview-float-card__icon {
  display: grid;
  width: 22px;
  height: 22px;
  color: var(--bili-color-success);
  background: var(--bili-color-success-light);
  border-radius: 5px;
  place-items: center;
}

.preview-float-card div {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.preview-float-card strong {
  font-size: 8px;
  font-weight: 500;
  color: var(--bili-text-primary);
}

.preview-float-card span:not(.preview-float-card__icon) {
  font-family: var(--bili-font-family-mono);
  font-size: 6px;
  color: var(--bili-text-placeholder);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 150ms var(--bili-transition-function);
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1120px) {
  .preview-shell {
    max-width: 640px;
  }

  .preview-float-card {
    right: 0;
  }
}

@media (max-width: 640px) {
  .preview-window {
    min-height: 0;
  }

  .preview-sidebar {
    display: none;
  }

  .preview-main {
    padding: 14px;
  }

  .preview-header {
    gap: 8px;
  }

  .preview-heading h2 {
    font-size: 17px;
  }

  .preview-header__actions :deep(.bili-button span) {
    display: none;
  }

  .preview-header__actions :deep(.bili-button) {
    width: 30px;
    padding: 0;
  }

  .preview-search {
    width: 112px;
  }

  .preview-stats {
    gap: 6px;
  }

  .preview-stat {
    min-width: 0;
    padding: 8px;
  }

  .preview-stat strong {
    font-size: 13px;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }

  .preview-panel--chart :deep(.bili-chart__legend) {
    display: none;
  }

  .preview-order__id {
    display: none;
  }

  .preview-order__amount {
    width: auto;
  }

  .preview-caption > span:last-child {
    display: none;
  }

  .preview-float-card {
    display: none;
  }

  .preview-order-table__head,
  .preview-order-table__row {
    grid-template-columns: minmax(66px, 1fr) minmax(82px, 1.2fr) minmax(46px, 0.8fr);
  }

  .preview-order-table__head span:nth-child(4),
  .preview-order-table__row > :last-child {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-fade-enter-active,
  .preview-fade-leave-active {
    transition: none;
  }
}
</style>
