<template>
  <BiliConfigProvider namespace="acme">
    <BiliSpace direction="vertical" :size="12">
      <BiliSpace align="center" wrap :size="12">
        <BiliButton type="primary">自定义命名空间</BiliButton>
        <BiliInput placeholder="输入内容" style="width: 180px" />
        <BiliSwitch :model-value="true" />
      </BiliSpace>
      <code class="hint">渲染出的类名：acme-button / acme-input / acme-switch</code>
    </BiliSpace>
  </BiliConfigProvider>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
