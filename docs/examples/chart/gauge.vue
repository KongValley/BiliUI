<script setup lang="ts">
import { ref } from 'vue'

const value = ref(72)
</script>

<template>
  <div class="gauge-demo">
    <BiliGaugeChart :value="value" label="任务完成率" />
    <label class="slider">
      调整数值：{{ value }}
      <input v-model.number="value" type="range" min="0" max="100" />
    </label>
  </div>
</template>

<style scoped>
.gauge-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  width: 100%;
  max-width: 360px;
}

.slider {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.slider input {
  width: 100%;
  accent-color: var(--bili-color-primary);
}
</style>
