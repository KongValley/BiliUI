<script setup lang="ts">
import { ref } from 'vue'

const score = ref(2.5)
const disabledScore = ref(4)
</script>

<template>
  <BiliSpace direction="vertical" size="md">
    <BiliRate v-model="score" allow-half show-text />
    <BiliRate :model-value="disabledScore" disabled />
    <BiliRate :model-value="3" readonly />
    <span class="hint">半星示例默认 2.5 分；后两个分别为禁用与只读状态</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
