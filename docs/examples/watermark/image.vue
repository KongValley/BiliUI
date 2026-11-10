<template>
  <BiliWatermark image="/logo.svg" :width="48" :height="48" :gap="[100, 100]">
    <div class="panel">
      <h4>图片水印</h4>
      <p>传入 image 后优先绘制图片水印，width / height 控制单个图标尺寸。</p>
    </div>
  </BiliWatermark>
</template>

<style scoped>
.panel {
  padding: 24px;
  background-color: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: var(--bili-text-primary);
}

p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}
</style>
