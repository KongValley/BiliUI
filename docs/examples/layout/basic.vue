<template>
  <div class="stack">
    <BiliLayout class="frame">
      <BiliLayoutHeader :height="48">顶部导航</BiliLayoutHeader>
      <BiliLayoutContent :padding="16">内容区域</BiliLayoutContent>
      <BiliLayoutFooter>页脚</BiliLayoutFooter>
    </BiliLayout>

    <BiliLayout class="frame" direction="horizontal">
      <BiliLayoutAside :width="140">侧边栏</BiliLayoutAside>
      <BiliLayout>
        <BiliLayoutHeader :height="48">顶部导航</BiliLayoutHeader>
        <BiliLayoutContent :padding="16">内容区域</BiliLayoutContent>
      </BiliLayout>
    </BiliLayout>

    <BiliLayout class="frame">
      <BiliLayoutHeader :height="48">顶部导航</BiliLayoutHeader>
      <BiliLayout direction="horizontal">
        <BiliLayoutContent :padding="16">内容区域</BiliLayoutContent>
        <BiliLayoutAside :width="140">右侧栏</BiliLayoutAside>
      </BiliLayout>
    </BiliLayout>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.frame {
  min-height: 150px;
  overflow: hidden;
  font-size: 13px;
  color: var(--bili-text-secondary);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 8px;
}

.frame :deep(.bili-layout-header),
.frame :deep(.bili-layout-aside),
.frame :deep(.bili-layout-footer) {
  justify-content: center;
}

.frame :deep(.bili-layout-aside) {
  display: flex;
  align-items: center;
}
</style>
