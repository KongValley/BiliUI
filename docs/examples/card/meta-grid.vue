<template>
  <BiliCard title="热门视频" body-flush style="max-width: 460px">
    <BiliCardMeta title="用 Vue 3 写一个组件库" description="UP 主 · 12.4 万播放">
      <template #avatar>
        <BiliAvatar name="B站" />
      </template>
    </BiliCardMeta>

    <div class="card-grids">
      <BiliCardGrid>4K 画质</BiliCardGrid>
      <BiliCardGrid>弹幕互动</BiliCardGrid>
      <BiliCardGrid>一键三连</BiliCardGrid>
    </div>
  </BiliCard>
</template>

<style scoped>
.card-grids {
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  border-top: 1px solid var(--bili-border-color-lighter);
}
</style>
