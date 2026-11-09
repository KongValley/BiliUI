<script setup lang="ts">
const cell = {
  padding: '10px 0',
  textAlign: 'center' as const,
  color: 'var(--bili-text-regular)',
  background: 'var(--bili-color-primary-light)',
  borderRadius: '6px',
  fontSize: '13px'
}

const offsetStyle = {
  ...cell,
  color: 'var(--bili-color-on-primary)',
  background: 'var(--bili-color-primary)',
  marginBottom: '8px'
}
</script>

<template>
  <div class="grid-demo">
    <span class="label">水平间距 gutter=16，垂直间距为数组第二项 16</span>
    <BiliRow :gutter="[16, 16]">
      <BiliCol v-for="i in 4" :key="i" :span="6">
        <div :style="cell">col {{ i }}</div>
      </BiliCol>
    </BiliRow>

    <span class="label">偏移 offset=6</span>
    <BiliRow :gutter="16">
      <BiliCol :span="12" :offset="6">
        <div :style="offsetStyle">span 12 / offset 6</div>
      </BiliCol>
    </BiliRow>

    <span class="label">对齐 justify=space-between</span>
    <BiliRow :gutter="16" justify="space-between">
      <BiliCol :span="6"><div :style="cell">6</div></BiliCol>
      <BiliCol :span="6"><div :style="cell">6</div></BiliCol>
      <BiliCol :span="6"><div :style="cell">6</div></BiliCol>
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
