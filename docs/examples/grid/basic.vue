<script setup lang="ts">
const boxStyle = {
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
    <BiliRow>
      <BiliCol :span="24"><div :style="boxStyle">span 24</div></BiliCol>
    </BiliRow>
    <BiliRow :gutter="12">
      <BiliCol :span="12"><div :style="boxStyle">span 12</div></BiliCol>
      <BiliCol :span="12"><div :style="boxStyle">span 12</div></BiliCol>
    </BiliRow>
    <BiliRow :gutter="12">
      <BiliCol :span="8"><div :style="boxStyle">span 8</div></BiliCol>
      <BiliCol :span="8"><div :style="boxStyle">span 8</div></BiliCol>
      <BiliCol :span="8"><div :style="boxStyle">span 8</div></BiliCol>
    </BiliRow>
    <BiliRow :gutter="12">
      <BiliCol v-for="i in 4" :key="i" :span="6">
        <div :style="boxStyle">span 6</div>
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
</style>
