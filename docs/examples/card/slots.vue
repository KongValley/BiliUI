<template>
  <div class="card-grid">
    <BiliCard title="带封面" size="sm">
      <template #cover>
        <div class="cover">封面区域</div>
      </template>
      <p>cover 插槽会渲染在头部之上，并裁切为卡片圆角。</p>
    </BiliCard>

    <BiliCard title="自定义头部">
      <template #header>
        <span class="custom-title">自定义标题</span>
      </template>
      <template #extra>
        <BiliTag type="success" size="sm">运行中</BiliTag>
      </template>
      <p>header 与 extra 插槽可完全自定义头部内容。</p>
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

.cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96px;
  font-size: 13px;
  color: var(--bili-color-on-primary);
  background: linear-gradient(135deg, #e0356b, #ff8fb1);
}

.custom-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--bili-color-primary);
}
</style>
