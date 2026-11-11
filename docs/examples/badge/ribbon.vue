<template>
  <BiliSpace :size="24" align="center" wrap>
    <BiliBadgeRibbon text="VIP">
      <div class="ribbon-card">
        <strong>大会员</strong>
        <span>4K 超清与专属装扮</span>
      </div>
    </BiliBadgeRibbon>

    <BiliBadgeRibbon text="NEW" placement="start" color="#22a06b">
      <div class="ribbon-card">
        <strong>新番上线</strong>
        <span>每周五 12:00 更新</span>
      </div>
    </BiliBadgeRibbon>
  </BiliSpace>
</template>

<style scoped>
.ribbon-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 220px;
  padding: 20px 16px;
  background-color: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

.ribbon-card strong {
  font-size: 16px;
  color: var(--bili-text-primary);
}

.ribbon-card span {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
