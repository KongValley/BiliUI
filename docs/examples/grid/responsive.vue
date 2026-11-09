<script setup lang="ts">
const cell = {
  padding: '10px 0',
  textAlign: 'center' as const,
  color: 'var(--bili-color-on-primary)',
  background: 'var(--bili-color-primary)',
  borderRadius: '6px',
  fontSize: '13px'
}
</script>

<template>
  <div class="grid-demo">
    <span class="label">
      拖窄浏览器窗口可看到变化：md 以上 8/8/8，md 以下 12/12，xs 以下整行
    </span>
    <BiliRow :gutter="[12, 12]">
      <BiliCol :xs="24" :md="12" :lg="8"><div :style="cell">响应式 col 1</div></BiliCol>
      <BiliCol :xs="24" :md="12" :lg="8"><div :style="cell">响应式 col 2</div></BiliCol>
      <BiliCol :xs="24" :md="12" :lg="8"><div :style="cell">响应式 col 3</div></BiliCol>
    </BiliRow>

    <span class="label">响应式 offset：lg 起向左偏移 4 栏，小屏不偏移</span>
    <BiliRow :gutter="[12, 12]">
      <BiliCol :xs="24" :lg="{ span: 8, offset: 4 }">
        <div :style="cell">span 8 / offset 4（仅 lg+）</div>
      </BiliCol>
    </BiliRow>
  </div>
</template>

<style scoped>
.grid-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.label {
  margin-top: 8px;
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
