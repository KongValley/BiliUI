<script setup lang="ts">
import { addIcons } from 'bili-ui'

addIcons({
  // 描边图标：默认模式，用 currentColor 描边
  rocket: {
    paths: [
      'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z',
      'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z',
      'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
      'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'
    ]
  },
  // 填充图标：品牌 logo 这类实心图形需要 mode: 'fill'
  'brand-mark': {
    mode: 'fill',
    paths: [
      'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 7 3.9v7.6l-7 3.9-7-3.9V8.2l7-3.9Z'
    ]
  },
  // 用 content 表达 path 无法绘制的图形（圆、矩形等）
  'brand-dot': {
    content: '<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" fill="#fff" />'
  }
})
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliSpace size="lg" wrap>
      <BiliSpace direction="vertical" size="sm" align="center">
        <BiliIcon name="rocket" :size="28" />
        <span class="label">注册的描边图标</span>
      </BiliSpace>
      <BiliSpace direction="vertical" size="sm" align="center">
        <BiliIcon name="brand-mark" :size="28" color="var(--bili-color-primary)" />
        <span class="label">注册的填充图标</span>
      </BiliSpace>
      <BiliSpace direction="vertical" size="sm" align="center">
        <BiliIcon name="brand-dot" :size="28" color="var(--bili-color-primary)" />
        <span class="label">content 图形</span>
      </BiliSpace>
    </BiliSpace>

    <span class="label">无需注册，直接传入 icon</span>
    <BiliSpace size="lg" wrap>
      <BiliSpace direction="vertical" size="sm" align="center">
        <BiliIcon :icon="['M12 2 2 22h20z']" :size="28" />
        <span class="label">数组形式 path</span>
      </BiliSpace>
      <BiliSpace direction="vertical" size="sm" align="center">
        <BiliIcon
          :icon="{ paths: ['M12 3l2.7 5.9 6.3.8-4.6 4.4 1.2 6.4L12 17.4 6.4 20.5l1.2-6.4L3 9.7l6.3-.8L12 3z'], mode: 'fill' }"
          :size="28"
          color="var(--bili-color-warning)"
        />
        <span class="label">对象形式（填充）</span>
      </BiliSpace>
      <BiliSpace direction="vertical" size="sm" align="center">
        <BiliIcon :icon="['M0 0h32v32H0z', 'M8 8h16v16H8']" view-box="0 0 32 32" :size="28" />
        <span class="label">32×32 viewBox</span>
      </BiliSpace>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
