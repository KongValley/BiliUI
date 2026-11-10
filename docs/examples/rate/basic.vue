<script setup lang="ts">
import { ref } from 'vue'

const score = ref(3)
const texts = ['很差', '一般', '不错', '很好', '极佳']
</script>

<template>
  <BiliSpace direction="vertical" size="md">
    <BiliRate v-model="score" show-text :texts="texts" />
    <span class="hint">当前评分：{{ score }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
