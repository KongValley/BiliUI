<script setup lang="ts">
const cell = {
  padding: '10px 12px',
  textAlign: 'center' as const,
  color: 'var(--bili-color-on-primary)',
  background: 'var(--bili-color-primary)',
  borderRadius: '6px',
  fontSize: '13px'
}

const muted = {
  ...cell,
  color: 'var(--bili-text-regular)',
  background: 'var(--bili-fill-color)'
}
</script>

<template>
  <div class="flex-demo">
    <span class="label">数字 flex 按比例分配剩余空间，flex="none" 保持内容宽度</span>
    <BiliRow :gutter="[12, 12]">
      <BiliCol :flex="1"><div :style="cell">flex: 1</div></BiliCol>
      <BiliCol :flex="2"><div :style="cell">flex: 2</div></BiliCol>
      <BiliCol flex="0 0 140px"><div :style="muted">固定 140px</div></BiliCol>
    </BiliRow>

    <span class="label">flex="auto" 自适应内容，不再受 span 宽度约束</span>
    <BiliRow :gutter="[12, 12]">
      <BiliCol flex="auto"><div :style="cell">auto</div></BiliCol>
      <BiliCol flex="auto"><div :style="muted">auto</div></BiliCol>
      <BiliCol flex="none"><div :style="muted">none</div></BiliCol>
    </BiliRow>
  </div>
</template>

<style scoped>
.flex-demo {
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
