<script setup lang="ts">
import { ref } from 'vue'
import { BiliMessage } from '@kongvalley/bili-ui'

const releaseVersion = ref('1.4.0')
const releaseChannel = ref('stable')
const autoPublish = ref(true)

const copyCommand = async (command: string) => {
  try {
    await navigator.clipboard.writeText(command)
    BiliMessage.success('命令已复制')
  } catch {
    BiliMessage.info(command)
  }
}

const categories = [
  {
    title: '基础与布局',
    count: '24',
    description: '从按钮、排版到栅格与分栏，先搭好稳固的页面骨架。',
    tags: ['Button', 'Typography', 'Grid', 'Splitter'],
    icon: 'grid',
    link: '/components/button'
  },
  {
    title: '表单与输入',
    count: '21',
    description: '完整覆盖录入、校验、选择与上传，复杂表单也能保持清晰。',
    tags: ['Form', 'Select', 'DatePicker', 'Upload'],
    icon: 'edit',
    link: '/components/form'
  },
  {
    title: '反馈与导航',
    count: '23',
    description: '让状态、操作与路径有迹可循，关键反馈不被忽略。',
    tags: ['Dialog', 'Message', 'Tabs', 'Menu'],
    icon: 'bell',
    link: '/components/dialog'
  },
  {
    title: '数据与展示',
    count: '47',
    description: '表格、虚拟列表、图表与统计卡片，承载真实业务的数据密度。',
    tags: ['Table', 'VirtualList', 'Chart', 'Card'],
    icon: 'chart',
    link: '/components/table'
  }
]

const principles = [
  {
    index: '01',
    title: '设计令牌，而不是魔法数字',
    description: '三层令牌把颜色、间距、圆角与状态收进同一套语义体系。换肤只改变量，不改组件。',
    link: '/guide/theme',
    linkText: '了解主题系统'
  },
  {
    index: '02',
    title: '类型，是最安静的文档',
    description: '每个 Props、事件与插槽都有精确类型。编辑器里能看到的约束，比文档更快一步。',
    link: '/guide/quickstart',
    linkText: '查看接入方式'
  },
  {
    index: '03',
    title: '只交付必要的运行时',
    description: '原生 Vue 3 实现，按需引入样式，SSR 安全。组件库应该加速产品，而不是拖慢页面。',
    link: '/guide/on-demand',
    linkText: '配置按需样式'
  }
]

const steps = [
  {
    number: '01',
    title: '安装',
    description: '一条命令加入你的 Vue 项目。',
    code: 'pnpm add @kongvalley/bili-ui'
  },
  {
    number: '02',
    title: '注册',
    description: '全量安装，或只引入需要的组件。',
    code: 'app.use(BiliUI)'
  },
  {
    number: '03',
    title: '开始构建',
    description: '从组件出发，保留你自己的设计判断。',
    code: '<BiliButton type="primary">'
  }
]
</script>

<template>
  <div class="home-sections">
    <section class="home-section home-components" aria-labelledby="home-components-title">
      <div class="home-section__head">
        <div>
          <span class="home-section__eyebrow">Component coverage</span>
          <h2 id="home-components-title">从第一行代码，到完整产品。</h2>
        </div>
        <div class="home-section__aside">
          <p>四大场景、115 个组件。每个组件独立可引入，也共享同一种视觉语言。</p>
          <a href="/components/button">查看组件总览 <span aria-hidden="true">→</span></a>
        </div>
      </div>

      <div class="home-category-grid">
        <a
          v-for="category in categories"
          :key="category.title"
          class="home-category"
          :href="category.link"
        >
          <div class="home-category__top">
            <span class="home-category__icon">
              <BiliIcon :name="category.icon" :size="17" />
            </span>
            <span class="home-category__count">{{ category.count }}</span>
          </div>
          <h3>{{ category.title }}</h3>
          <p>{{ category.description }}</p>
          <div class="home-category__tags">
            <span v-for="tag in category.tags" :key="tag">{{ tag }}</span>
          </div>
        </a>
      </div>

      <div class="home-component-board">
        <div class="home-component-board__label">
          <span class="home-section__eyebrow">Live components</span>
          <p>下方所有元素都来自 Bili UI，并直接响应右上角的主题切换。</p>
        </div>

        <div class="home-component-board__stage">
          <div class="home-demo-card">
            <div class="home-demo-card__head">
              <div>
                <span>发布设置</span>
                <small>组件组合实例</small>
              </div>
              <BiliTag type="primary" size="sm">Release</BiliTag>
            </div>
            <BiliInput v-model="releaseVersion" placeholder="版本名称，例如 1.4.0" size="sm">
              <template #prefix><BiliIcon name="bookmark" :size="13" /></template>
            </BiliInput>
            <div class="home-demo-card__row">
              <div class="home-demo-card__select">
                <BiliSelect
                  v-model="releaseChannel"
                  :options="[
                    { label: '稳定版', value: 'stable' },
                    { label: '候选版', value: 'rc' }
                  ]"
                  size="sm"
                />
              </div>
              <BiliSwitch v-model="autoPublish" size="sm" aria-label="自动发布" />
            </div>
            <div class="home-demo-card__actions">
              <BiliButton size="sm">保存草稿</BiliButton>
              <BiliButton size="sm" type="primary" @click="BiliMessage.success('发布流程已启动')">
                立即发布
              </BiliButton>
            </div>
          </div>

          <div class="home-demo-feedback">
            <div class="home-demo-feedback__icon"><BiliIcon name="success" :size="16" /></div>
            <div>
              <strong>构建完成</strong>
              <span>主包 42.6 KB · 样式 8.1 KB</span>
            </div>
            <BiliProgress
              type="circle"
              :percentage="100"
              :size="32"
              :stroke-width="4"
              :show-text="false"
            />
          </div>

          <div class="home-demo-tokens">
            <div class="home-demo-tokens__head">
              <span>品牌色</span>
              <code>--bili-color-primary</code>
            </div>
            <div class="home-demo-tokens__swatches">
              <span style="background: var(--bili-color-primary)" />
              <span style="background: var(--bili-color-primary-hover)" />
              <span style="background: var(--bili-color-primary-light)" />
              <span style="background: var(--bili-text-primary)" />
              <span style="background: var(--bili-fill-color)" />
            </div>
          </div>

          <div class="home-demo-type">
            <span class="home-demo-type__small">Aa</span>
            <span class="home-demo-type__large">文字与留白</span>
            <code>Segoe UI · 400 / 600</code>
          </div>

          <div class="home-demo-tags">
            <BiliTag type="success" size="sm">已通过</BiliTag>
            <BiliTag type="warning" size="sm">待复核</BiliTag>
            <BiliTag size="sm">草稿</BiliTag>
            <BiliBadge :value="8">
              <BiliButton size="sm" icon="bell" circle aria-label="通知" />
            </BiliBadge>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section home-principles" aria-labelledby="home-principles-title">
      <div class="home-section__head home-section__head--principles">
        <div>
          <span class="home-section__eyebrow">Built for the long run</span>
          <h2 id="home-principles-title">漂亮只是起点。</h2>
        </div>
        <p>一套能长期维护的组件库，应该让设计、开发与业务在同一个坐标系里工作。</p>
      </div>

      <div class="home-principle-grid">
        <a
          v-for="principle in principles"
          :key="principle.index"
          class="home-principle"
          :href="principle.link"
        >
          <span class="home-principle__index">{{ principle.index }}</span>
          <h3>{{ principle.title }}</h3>
          <p>{{ principle.description }}</p>
          <span class="home-principle__link"
            >{{ principle.linkText }} <span aria-hidden="true">→</span></span
          >
        </a>
      </div>
    </section>

    <section class="home-section home-start" aria-labelledby="home-start-title">
      <div class="home-start__intro">
        <span class="home-section__eyebrow">Start in minutes</span>
        <h2 id="home-start-title">下一次构建，<br />从一个好组件开始。</h2>
        <p>安装、注册、使用。没有额外配置，也没有需要猜测的约定。</p>
        <div class="home-start__actions">
          <a class="home-start__primary" href="/guide/quickstart"
            >阅读快速开始 <span aria-hidden="true">→</span></a
          >
          <a href="https://github.com/KongValley/BiliUI" rel="noreferrer"
            >在 GitHub 查看 <span aria-hidden="true">↗</span></a
          >
        </div>
      </div>

      <ol class="home-steps">
        <li v-for="step in steps" :key="step.number" class="home-step">
          <span class="home-step__number">{{ step.number }}</span>
          <div class="home-step__body">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
          <div class="home-step__code">
            <code>{{ step.code }}</code>
            <button
              type="button"
              :aria-label="`复制${step.title}命令`"
              @click="copyCommand(step.code)"
            >
              <BiliIcon name="copy" :size="13" />
            </button>
          </div>
        </li>
      </ol>
    </section>

    <section class="home-newsletter" aria-labelledby="home-newsletter-title">
      <div>
        <span class="home-section__eyebrow">Release notes</span>
        <h2 id="home-newsletter-title">每一次更新，都有迹可循。</h2>
        <p>查看版本记录、主题接入方式与完整组件 API，保持项目与上游同步。</p>
      </div>
      <div class="home-newsletter__actions">
        <a class="home-newsletter__primary" href="/guide/roadmap">
          查看版本计划
          <span aria-hidden="true">→</span>
        </a>
        <a href="/guide/theme">主题定制</a>
        <a href="/guide/api">API 参考</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-sections {
  width: 100%;
  max-width: 1280px;
  padding: 0 32px;
  margin: 0 auto;
}

.home-section {
  padding: 76px 0;
  border-top: 1px solid var(--bili-border-color-lighter);
}

.home-section__head {
  display: flex;
  gap: 48px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
}

.home-section__eyebrow {
  display: block;
  margin-bottom: 13px;
  font-family: var(--bili-font-family-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--bili-color-primary);
  text-transform: uppercase;
}

.home-section h2 {
  margin: 0;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 600;
  line-height: 1.22;
  letter-spacing: -0.045em;
  color: var(--bili-text-primary);
}

.home-section__aside {
  max-width: 300px;
}

.home-section__aside p,
.home-section__head--principles > p {
  margin: 0;
  font-size: 13px;
  line-height: 1.85;
  color: var(--bili-text-secondary);
}

.home-section__aside a {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin-top: 12px;
  font-size: 12px;
  color: var(--bili-text-regular);
  text-decoration: none;
}

.home-section__aside a:hover {
  color: var(--bili-color-primary);
}

.home-category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--bili-border-color-light);
  border-left: 1px solid var(--bili-border-color-light);
}

.home-category {
  display: flex;
  flex-direction: column;
  min-height: 226px;
  padding: 24px;
  color: inherit;
  text-decoration: none;
  background: var(--bili-bg-container);
  border-right: 1px solid var(--bili-border-color-light);
  border-bottom: 1px solid var(--bili-border-color-light);
  transition: background-color var(--bili-transition-duration);
}

.home-category:hover {
  background: var(--bili-fill-color-lighter);
}

.home-category__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.home-category__icon {
  display: grid;
  width: 34px;
  height: 34px;
  color: var(--bili-text-primary);
  background: var(--bili-fill-color-light);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 7px;
  place-items: center;
  transition:
    color var(--bili-transition-duration),
    border-color var(--bili-transition-duration);
}

.home-category:hover .home-category__icon {
  color: var(--bili-color-primary);
  border-color: color-mix(in srgb, var(--bili-color-primary) 35%, var(--bili-border-color-light));
}

.home-category__count {
  font-family: var(--bili-font-family-mono);
  font-size: 11px;
  color: var(--bili-text-placeholder);
}

.home-category h3 {
  margin: 24px 0 7px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--bili-text-primary);
}

.home-category p {
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
  color: var(--bili-text-secondary);
}

.home-category__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: auto;
  padding-top: 18px;
}

.home-category__tags span {
  padding: 3px 6px;
  font-family: var(--bili-font-family-mono);
  font-size: 9px;
  color: var(--bili-text-placeholder);
  background: var(--bili-fill-color-lighter);
  border-radius: 3px;
}

.home-component-board {
  display: grid;
  grid-template-columns: minmax(200px, 0.7fr) minmax(0, 2fr);
  gap: 32px;
  align-items: center;
  padding: 28px;
  margin-top: 16px;
  background: var(--bili-fill-color-lighter);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 10px;
}

.home-component-board__label p {
  max-width: 240px;
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
  color: var(--bili-text-secondary);
}

.home-component-board__stage {
  display: grid;
  grid-template-columns: minmax(200px, 1.35fr) minmax(150px, 1fr);
  gap: 10px;
  align-items: stretch;
}

.home-demo-card {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 15px;
  background: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
}

.home-demo-card__head {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 3px;
}

.home-demo-card__head > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.home-demo-card__head span:not(.bili-tag) {
  font-size: 12px;
  font-weight: 500;
  color: var(--bili-text-primary);
}

.home-demo-card__head small {
  font-size: 9px;
  color: var(--bili-text-placeholder);
}

.home-demo-card__row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.home-demo-card__select {
  flex: 1;
  min-width: 0;
}

.home-demo-card__actions {
  display: flex;
  gap: 7px;
  justify-content: flex-end;
  padding-top: 3px;
}

.home-demo-feedback,
.home-demo-tokens,
.home-demo-type {
  padding: 14px;
  background: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
}

.home-demo-feedback {
  display: flex;
  gap: 9px;
  align-items: center;
  grid-column: 2;
}

.home-demo-feedback__icon {
  display: grid;
  flex: none;
  width: 26px;
  height: 26px;
  color: var(--bili-color-success);
  background: var(--bili-color-success-light);
  border-radius: 6px;
  place-items: center;
}

.home-demo-feedback > div:nth-child(2) {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.home-demo-feedback strong {
  font-size: 10px;
  font-weight: 500;
  color: var(--bili-text-primary);
}

.home-demo-feedback span {
  font-size: 8px;
  color: var(--bili-text-placeholder);
}

.home-demo-tokens {
  grid-column: 1;
}

.home-demo-tokens__head {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
  font-size: 9px;
  color: var(--bili-text-secondary);
}

.home-demo-tokens__head code {
  font-family: var(--bili-font-family-mono);
  font-size: 7px;
  color: var(--bili-text-placeholder);
}

.home-demo-tokens__swatches {
  display: flex;
  height: 18px;
  margin-top: 11px;
  overflow: hidden;
  border: 1px solid var(--bili-border-color-light);
  border-radius: 4px;
}

.home-demo-tokens__swatches span {
  flex: 1;
}

.home-demo-type {
  display: flex;
  flex-direction: column;
  gap: 3px;
  grid-column: 2;
}

.home-demo-type__small {
  font-family: var(--bili-font-family-mono);
  font-size: 10px;
  color: var(--bili-text-placeholder);
}

.home-demo-type__large {
  font-size: 13px;
  font-weight: 600;
  color: var(--bili-text-primary);
  letter-spacing: -0.025em;
}

.home-demo-type code {
  font-family: var(--bili-font-family-mono);
  font-size: 7px;
  color: var(--bili-text-placeholder);
}

.home-demo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  grid-column: 1 / -1;
  padding: 2px 2px 0;
}

.home-principles {
  padding-top: 84px;
}

.home-section__head--principles {
  align-items: flex-end;
}

.home-section__head--principles > p {
  max-width: 340px;
}

.home-principle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid var(--bili-border-color-light);
}

.home-principle {
  display: flex;
  flex-direction: column;
  min-height: 245px;
  padding: 24px 28px 22px 0;
  color: inherit;
  text-decoration: none;
}

.home-principle + .home-principle {
  padding-left: 28px;
  border-left: 1px solid var(--bili-border-color-lighter);
}

.home-principle__index {
  font-family: var(--bili-font-family-mono);
  font-size: 10px;
  color: var(--bili-color-primary);
}

.home-principle h3 {
  max-width: 270px;
  margin: 24px 0 9px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.03em;
  color: var(--bili-text-primary);
}

.home-principle p {
  max-width: 300px;
  margin: 0;
  font-size: 12px;
  line-height: 1.85;
  color: var(--bili-text-secondary);
}

.home-principle__link {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  margin-top: auto;
  padding-top: 18px;
  font-size: 11px;
  color: var(--bili-text-regular);
  text-decoration: none;
}

.home-principle:hover .home-principle__link {
  color: var(--bili-color-primary);
}

.home-start {
  display: grid;
  grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.2fr);
  gap: 64px;
  padding: 70px 0;
}

.home-start__intro h2 {
  max-width: 350px;
  font-size: clamp(28px, 3vw, 38px);
}

.home-start__intro > p {
  max-width: 300px;
  margin: 18px 0 0;
  font-size: 12px;
  line-height: 1.85;
  color: var(--bili-text-secondary);
}

.home-start__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-top: 24px;
}

.home-start__actions a {
  font-size: 12px;
  color: var(--bili-text-regular);
  text-decoration: none;
}

.home-start__actions a:hover {
  color: var(--bili-color-primary);
}

.home-start__actions .home-start__primary {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: var(--bili-color-on-primary);
  background: var(--bili-color-primary);
  border-radius: 5px;
  padding: 9px 12px;
}

.home-start__actions .home-start__primary:hover {
  color: var(--bili-color-on-primary);
  background: var(--bili-color-primary-hover);
}

.home-steps {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  list-style: none;
}

.home-step {
  display: grid;
  grid-template-columns: 34px minmax(100px, 0.9fr) minmax(170px, 1.2fr);
  gap: 16px;
  align-items: center;
  padding: 17px 0;
  border-top: 1px solid var(--bili-border-color-light);
}

.home-step:last-child {
  border-bottom: 1px solid var(--bili-border-color-light);
}

.home-step__number {
  font-family: var(--bili-font-family-mono);
  font-size: 10px;
  color: var(--bili-color-primary);
}

.home-step__body h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--bili-text-primary);
}

.home-step__body p {
  margin: 5px 0 0;
  font-size: 10px;
  line-height: 1.6;
  color: var(--bili-text-secondary);
}

.home-step__code {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  background: var(--bili-code-bg);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 5px;
}

.home-step__code code {
  flex: 1;
  min-width: 0;
  padding: 7px 9px;
  overflow: hidden;
  font-family: var(--bili-font-family-mono);
  font-size: 9px;
  color: var(--bili-text-regular);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-step__code button {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  padding: 0;
  color: var(--bili-text-placeholder);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-left: 1px solid var(--bili-border-color-light);
}

.home-step__code button:hover {
  color: var(--bili-color-primary);
}

.home-newsletter {
  display: flex;
  gap: 36px;
  align-items: flex-end;
  justify-content: space-between;
  padding: 36px 0 58px;
  border-top: 1px solid var(--bili-border-color-lighter);
}

.home-newsletter h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--bili-text-primary);
}

.home-newsletter p {
  margin: 7px 0 0;
  font-size: 11px;
  color: var(--bili-text-secondary);
}

.home-newsletter__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
}

.home-newsletter__actions a {
  font-size: 12px;
  color: var(--bili-text-secondary);
  text-decoration: none;
}

.home-newsletter__actions a:hover {
  color: var(--bili-color-primary);
}

.home-newsletter__actions .home-newsletter__primary {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  height: 35px;
  padding: 0 13px;
  font-weight: 500;
  color: var(--bili-color-on-primary);
  background: var(--bili-color-primary);
  border-radius: 5px;
}

.home-newsletter__actions .home-newsletter__primary:hover {
  color: var(--bili-color-on-primary);
  background: var(--bili-color-primary-hover);
}

@media (max-width: 959px) {
  .home-sections {
    padding: 0 24px;
  }

  .home-section {
    padding: 56px 0;
  }

  .home-section__head {
    gap: 24px;
  }

  .home-category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-category {
    min-height: 210px;
  }

  .home-component-board {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 22px;
  }

  .home-component-board__label p {
    max-width: 500px;
  }

  .home-start {
    gap: 32px;
  }

  .home-step {
    grid-template-columns: 30px minmax(90px, 0.9fr) minmax(150px, 1.1fr);
    gap: 12px;
  }
}

@media (max-width: 767px) {
  .home-sections {
    padding: 0 20px;
  }

  .home-section {
    padding: 44px 0;
  }

  .home-section__head,
  .home-section__head--principles {
    display: block;
    margin-bottom: 24px;
  }

  .home-section__aside,
  .home-section__head--principles > p {
    max-width: none;
    margin-top: 14px;
  }

  .home-section h2 {
    font-size: 28px;
  }

  .home-category-grid {
    grid-template-columns: 1fr;
  }

  .home-category {
    min-height: 190px;
    padding: 20px;
  }

  .home-component-board {
    padding: 16px;
  }

  .home-component-board__stage {
    grid-template-columns: 1fr;
  }

  .home-demo-feedback,
  .home-demo-tokens,
  .home-demo-type,
  .home-demo-tags {
    grid-column: auto;
  }

  .home-principles {
    padding-top: 50px;
  }

  .home-principle-grid {
    grid-template-columns: 1fr;
  }

  .home-principle,
  .home-principle + .home-principle {
    min-height: 0;
    padding: 22px 0;
    border-left: 0;
    border-bottom: 1px solid var(--bili-border-color-lighter);
  }

  .home-principle:last-child {
    border-bottom: 0;
  }

  .home-principle h3 {
    margin-top: 14px;
  }

  .home-principle__link {
    padding-top: 13px;
  }

  .home-start {
    grid-template-columns: 1fr;
    padding: 48px 0;
  }

  .home-step {
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 8px 12px;
    padding: 15px 0;
  }

  .home-step__code {
    grid-column: 2;
  }

  .home-newsletter {
    display: block;
    padding: 28px 0 44px;
  }

  .home-newsletter__actions {
    margin-top: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-category,
  .home-category__icon {
    transition: none;
  }
}
</style>
