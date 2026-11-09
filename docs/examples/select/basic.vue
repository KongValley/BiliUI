<script setup lang="ts">
import { ref } from 'vue'

const value = ref('shanghai')

const options = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen', disabled: true }
]
</script>

<template>
  <BiliSpace direction="vertical" size="lg" style="width: 320px">
    <BiliSelect v-model="value" :options="options" placeholder="请选择城市" />
    <BiliSelect
      :model-value="null"
      :options="options"
      placeholder="禁用状态"
      disabled
    />
    <span class="value-text">当前值：{{ value }}</span>
  </BiliSpace>
</template>

<style scoped>
.value-text {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
