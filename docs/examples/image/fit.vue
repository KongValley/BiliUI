<script setup lang="ts">
const fits = [
  { value: 'cover', label: 'cover 裁剪填满' },
  { value: 'contain', label: 'contain 完整显示' },
  { value: 'fill', label: 'fill 拉伸填满' }
] as const
</script>

<template>
  <BiliSpace :size="16" wrap>
    <div v-for="fit in fits" :key="fit.value" class="item">
      <BiliImage src="/image-demo-2.svg" :fit="fit.value" :width="200" :height="130" />
      <span class="label">{{ fit.label }}</span>
    </div>
  </BiliSpace>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
