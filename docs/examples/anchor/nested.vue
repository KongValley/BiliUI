<script setup lang="ts">
import { ref } from 'vue'

const scroller = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="anchor-demo">
    <BiliAnchor :container="scroller" :offset="12" class="anchor">
      <BiliAnchorLink href="#anchor-nested-start" title="快速开始" />
      <BiliAnchorLink href="#anchor-nested-config" title="配置">
        <template #sub-link>
          <BiliAnchorLink href="#anchor-nested-container" title="容器" />
          <BiliAnchorLink href="#anchor-nested-offset" title="偏移" />
        </template>
      </BiliAnchorLink>
      <BiliAnchorLink href="#anchor-nested-faq" title="常见问题" />
    </BiliAnchor>

    <div ref="scroller" class="scroller">
      <section id="anchor-nested-start">
        <h4>快速开始</h4>
        <p>引入 Anchor 与 AnchorLink，将 href 指向页面中的区块 id。</p>
        <p>子级链接写在 sub-link 插槽中，父级会自动保持激活态。</p>
      </section>
      <section id="anchor-nested-config">
        <h4>配置</h4>
        <p>容器既可以是选择器字符串，也可以直接传入元素引用。</p>
      </section>
      <section id="anchor-nested-container">
        <h4>容器</h4>
        <p>未传 container 时监听窗口滚动，适合整页锚点导航。</p>
        <p>传入 container 后，激活判定与滚动都限定在该容器内部。</p>
      </section>
      <section id="anchor-nested-offset">
        <h4>偏移</h4>
        <p>存在固定顶栏时，用 offset 预留出顶栏高度。</p>
        <p>bound 用于吸收像素级误差，默认 15px。</p>
      </section>
      <section id="anchor-nested-faq">
        <h4>常见问题</h4>
        <p>目标区块必须真实存在于文档中，否则点击会退回浏览器默认跳转行为。</p>
        <p>滚动监听使用 passive 模式，不会阻塞页面滚动。</p>
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
  width: 160px;
}

.scroller {
  flex: 1;
  height: 300px;
  overflow-y: auto;
  background-color: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

section {
  padding: 20px 24px;
  border-bottom: 1px solid var(--bili-border-color-lighter);
}

section:last-child {
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
