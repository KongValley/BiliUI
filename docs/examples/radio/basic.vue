<script setup lang="ts">
import { ref } from 'vue'

const value = ref('vue')
const disabledValue = ref('a')
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliRadioGroup v-model="value">
      <BiliRadio value="vue">Vue</BiliRadio>
      <BiliRadio value="react">React</BiliRadio>
      <BiliRadio value="svelte">Svelte</BiliRadio>
    </BiliRadioGroup>

    <BiliRadioGroup v-model="disabledValue" disabled>
      <BiliRadio value="a">禁用选项 A</BiliRadio>
      <BiliRadio value="b">禁用选项 B</BiliRadio>
    </BiliRadioGroup>

    <span class="value-text">当前选择：{{ value }}</span>
  </BiliSpace>
</template>

<style scoped>
.value-text {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
