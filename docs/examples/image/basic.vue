<script setup lang="ts">
const previewList = ['/image-demo-1.svg', '/image-demo-2.svg', '/image-demo-3.svg']
</script>

<template>
  <BiliSpace :size="20" wrap align="center">
    <BiliImage
      src="/image-demo-1.svg"
      alt="示例图片"
      :preview-src-list="previewList"
      :width="280"
      :height="170"
      fit="cover"
    />
    <span class="hint"
      >悬停后点击「预览」，可用底部工具栏缩放、旋转，方向键或两侧按钮切换图片。</span
    >
  </BiliSpace>
</template>

<style scoped>
.hint {
  max-width: 260px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}
</style>
