<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace wrap>
      <BiliButton>按钮</BiliButton>
      <BiliButton>按钮</BiliButton>
      <BiliButton>按钮</BiliButton>
    </BiliSpace>

    <BiliSpace size="lg" wrap>
      <BiliButton type="primary">间距 16px</BiliButton>
      <BiliButton type="primary">间距 16px</BiliButton>
      <BiliButton type="primary">间距 16px</BiliButton>
    </BiliSpace>

    <BiliSpace direction="vertical" align="start">
      <span>垂直排列</span>
      <span>垂直排列</span>
      <span>垂直排列</span>
    </BiliSpace>

    <div class="wrap-box">
      <BiliSpace wrap :size="8">
        <BiliTag v-for="index in 8" :key="index" type="primary">
          标签 {{ index }}
        </BiliTag>
      </BiliSpace>
    </div>
  </BiliSpace>
</template>

<style scoped>
.wrap-box {
  width: 220px;
  padding: 12px;
  border: 1px dashed var(--bili-border-color);
  border-radius: 8px;
}
</style>
