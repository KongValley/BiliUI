<script setup lang="ts">
import { ref } from 'vue'

const time = ref('10:30')
const meeting = ref('')
const custom = ref('')
</script>

<template>
  <BiliSpace :size="24" align="start" wrap>
    <BiliSpace direction="vertical" size="sm">
      <span class="label">默认 09:00 – 18:00</span>
      <BiliTimeSelect v-model="time" style="width: 200px" />
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">自定义区间与步长</span>
      <BiliTimeSelect
        v-model="meeting"
        start="08:00"
        end="12:00"
        step="00:15"
        style="width: 200px"
      />
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">固定选项</span>
      <BiliTimeSelect
        v-model="custom"
        :options="['09:00', '12:30', '18:00']"
        style="width: 200px"
      />
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
