<script setup lang="ts">
import { ref } from 'vue'

const count = ref(3)
const price = ref(1299)
const ratio = ref<number | undefined>(0.125)
const free = ref<number | undefined>()
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">基础步进</span>
      <BiliSpace :size="12" align="center" wrap>
        <BiliInputNumber v-model="count" :min="0" :max="10" />
        <BiliInputNumber v-model="price" :step="100" :min="0" :max="9999" />
        <BiliInputNumber v-model="ratio" :step="0.005" :precision="3" />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">状态与形态</span>
      <BiliSpace :size="12" align="center" wrap>
        <BiliInputNumber :model-value="5" disabled />
        <BiliInputNumber v-model="free" placeholder="清空后为 undefined" />
        <BiliInputNumber :model-value="42" :controls="false" placeholder="无步进按钮" />
        <BiliInputNumber :model-value="1280" align="right" />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">尺寸</span>
      <BiliSpace :size="12" align="center" wrap>
        <BiliInputNumber :model-value="1" size="sm" />
        <BiliInputNumber :model-value="2" size="md" />
        <BiliInputNumber :model-value="3" size="lg" />
      </BiliSpace>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
