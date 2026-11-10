<script setup lang="ts">
import { ref } from 'vue'

const count = ref(3)
const price = ref(1299)
const ratio = ref(35)
const range = ref<[number, number]>([20, 70])
const marked = ref(50)
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">数字输入</span>
      <BiliSpace :size="12" align="center" wrap>
        <BiliInputNumber v-model="count" :min="0" :max="10" />
        <BiliInputNumber v-model="price" :step="100" :min="0" :max="9999" />
        <BiliInputNumber :model-value="0.125" :step="0.005" :precision="3" />
        <BiliInputNumber :model-value="5" disabled />
        <BiliInputNumber :model-value="42" :controls="false" placeholder="无步进" />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">滑块</span>
      <BiliSpace direction="vertical" size="md" fill style="max-width: 420px">
        <BiliSlider v-model="ratio" />
        <BiliSlider v-model="range" />
        <BiliSlider
          v-model="marked"
          :marks="{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }"
        />
        <BiliSlider :model-value="60" disabled />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace :size="24" align="center">
      <BiliSlider :model-value="70" vertical style="height: 140px" />
      <span class="label">纵向滑块</span>
    </BiliSpace>

    <div class="result">
      <span class="label">当前值：</span>
      <code>count={{ count }}</code>
      <code>price={{ price }}</code>
      <code>ratio={{ ratio }}</code>
      <code>range={{ range.join(' ~ ') }}</code>
      <code>marked={{ marked }}</code>
    </div>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.result {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: var(--bili-text-secondary);
}

code {
  padding: 1px 6px;
  color: var(--bili-text-primary);
  background: var(--bili-fill-color-light);
  border-radius: 4px;
}
</style>
