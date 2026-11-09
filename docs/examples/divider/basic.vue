<template>
  <div class="divider-demo">
    <p>默认分割线</p>
    <BiliDivider />
    <p>带文字的分割线</p>
    <BiliDivider>分割文字</BiliDivider>
    <BiliDivider content-position="left">靠左</BiliDivider>
    <BiliDivider content-position="right">靠右</BiliDivider>
    <p>虚线分割线</p>
    <BiliDivider dashed />
    <p>
      行内分割
      <BiliDivider direction="vertical" />
      行内分割
      <BiliDivider direction="vertical" dashed />
      行内分割
    </p>
  </div>
</template>

<style scoped>
.divider-demo p {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--bili-text-regular);
}
</style>
