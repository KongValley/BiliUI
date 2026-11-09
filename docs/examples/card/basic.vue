<template>
  <div class="card-grid">
    <BiliCard title="基础卡片" extra="更多">
      <p>卡片用于承载一组相关信息，正文区域默认带 16px 内边距。</p>
    </BiliCard>

    <BiliCard title="带底部操作">
      <p>通过 footer 插槽放置操作按钮。</p>
      <template #footer>
        <BiliSpace>
          <BiliButton size="sm">取消</BiliButton>
          <BiliButton size="sm" type="primary">保存</BiliButton>
        </BiliSpace>
      </template>
    </BiliCard>
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  width: 100%;
}

.card-grid p {
  margin: 0;
}
</style>
