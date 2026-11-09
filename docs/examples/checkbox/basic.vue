<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(true)
const indeterminate = ref(true)
const group = ref(['vue'])
const limited = ref(['a'])
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliSpace wrap>
      <BiliCheckbox v-model="checked">已同意用户协议</BiliCheckbox>
      <BiliCheckbox :model-value="true" disabled>禁用选中</BiliCheckbox>
      <BiliCheckbox :model-value="false" disabled>禁用未选</BiliCheckbox>
    </BiliSpace>

    <BiliCheckbox v-model="indeterminate" indeterminate>半选状态</BiliCheckbox>

    <span class="group-title">多选组</span>
    <BiliCheckboxGroup v-model="group">
      <BiliCheckbox value="vue">Vue</BiliCheckbox>
      <BiliCheckbox value="react">React</BiliCheckbox>
      <BiliCheckbox value="svelte">Svelte</BiliCheckbox>
    </BiliCheckboxGroup>

    <span class="group-title">最多选择 2 项</span>
    <BiliCheckboxGroup v-model="limited" :max="2">
      <BiliCheckbox value="a">选项 A</BiliCheckbox>
      <BiliCheckbox value="b">选项 B</BiliCheckbox>
      <BiliCheckbox value="c">选项 C</BiliCheckbox>
    </BiliCheckboxGroup>
  </BiliSpace>
</template>

<style scoped>
.group-title {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
