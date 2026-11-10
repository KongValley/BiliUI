<script setup lang="ts">
import { ref } from 'vue'

const time = ref('')

const disabledMinutes = (hour: number) => (hour === 12 ? [0, 30] : [])
</script>

<template>
  <BiliSpace direction="vertical" :size="12" style="width: 240px">
    <BiliTimePicker
      v-model="time"
      show-seconds
      :minute-step="15"
      :second-step="10"
      :disabled-minutes="disabledMinutes"
    />
    <span class="hint"> 分钟步长为 15、秒步长为 10；12 点的 00 分与 30 分被禁用。 </span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}
</style>
