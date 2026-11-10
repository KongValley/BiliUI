<script setup lang="ts">
const font = {
  color: 'rgba(224, 53, 107, 0.28)',
  fontSize: 16,
  fontWeight: 600
}
</script>

<template>
  <BiliWatermark content="Bili UI" :font="font" :width="110" :height="48" :gap="[90, 90]">
    <div class="panel">
      <h4>受保护的内容</h4>
      <p>水印覆盖在容器上层，不阻挡鼠标交互，适合后台详情页、报表与导出预览。</p>
      <p>修改 content、font、gap 等属性会重新生成纹理。</p>
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
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}
</style>
