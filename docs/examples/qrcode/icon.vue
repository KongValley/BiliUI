<template>
  <BiliSpace :size="24" wrap align="center">
    <BiliQRCode value="https://bili-ui.dev" :size="180" icon="/logo.svg" :icon-size="44" />
    <span class="hint">传入 icon 会在二维码中心绘制图标，并自动垫一层背景色保证可扫描。</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  max-width: 220px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}
</style>
