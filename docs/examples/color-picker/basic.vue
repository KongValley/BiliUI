<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#e0356b')
</script>

<template>
  <BiliSpace direction="vertical" size="md" style="width: 260px">
    <BiliColorPicker v-model="color" clearable />
    <span class="hint">当前颜色：{{ color || '空' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
