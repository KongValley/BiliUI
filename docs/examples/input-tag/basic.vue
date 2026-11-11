<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['Vue', 'Vite'])
const limited = ref(['设计'])
const readonly = ref(['只读标签'])
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm">
      <span class="label">基础用法</span>
      <BiliInputTag v-model="tags" clearable style="max-width: 420px" />
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">最多 3 个标签</span>
      <BiliInputTag v-model="limited" :max="3" style="max-width: 420px" />
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">只读</span>
      <BiliInputTag v-model="readonly" readonly style="max-width: 420px" />
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
