<script setup lang="ts">
import { ref } from 'vue'

const scroller = ref<HTMLElement | null>(null)

const sections = [
  {
    id: 'anchor-basic-intro',
    title: '介绍',
    text: '锚点组件用于长页面内的快速定位，滚动容器时自动高亮当前章节。'
  },
  {
    id: 'anchor-basic-usage',
    title: '使用方式',
    text: '通过 container 指定滚动容器，href 指向目标区块的 id，点击后平滑滚动到对应位置。'
  },
  {
    id: 'anchor-basic-offset',
    title: '偏移与容差',
    text: 'offset 控制目标距离容器顶部的间距，bound 决定激活判定的容差范围。'
  },
  {
    id: 'anchor-basic-theme',
    title: '主题适配',
    text: '激活态与标识条均使用语义 CSS 变量，暗色模式下自动适配。'
  }
]
</script>

<template>
  <div class="anchor-demo">
    <BiliAnchor :container="scroller" :offset="12" :bound="8" class="anchor">
      <BiliAnchorLink
        v-for="section in sections"
        :key="section.id"
        :href="`#${section.id}`"
        :title="section.title"
      />
    </BiliAnchor>

    <div ref="scroller" class="scroller">
      <section v-for="section in sections" :id="section.id" :key="section.id" class="section">
        <h4>{{ section.title }}</h4>
        <p>{{ section.text }}</p>
        <p>
          这里是一段用于撑开高度的占位内容，滚动右侧容器可以看到左侧锚点的激活状态随可视区域变化。
        </p>
        <p>Bili Anchor 使用 scroll 事件配合 requestAnimationFrame 节流，不依赖第三方滚动库。</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.anchor {
  flex-shrink: 0;
  width: 150px;
}

.scroller {
  flex: 1;
  height: 280px;
  overflow-y: auto;
  background-color: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

.section {
  padding: 20px 24px;
  border-bottom: 1px solid var(--bili-border-color-lighter);
}

.section:last-child {
  border-bottom: 0;
}

h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: var(--bili-text-primary);
}

p {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}
</style>
