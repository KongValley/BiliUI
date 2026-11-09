<script setup lang="ts">
import { ref } from 'vue'

const tooltipRef = ref()
</script>

<template>
  <BiliSpace wrap>
    <BiliTooltip content="点击切换显示状态" trigger="click">
      <BiliButton>点击触发</BiliButton>
    </BiliTooltip>

    <BiliTooltip content="聚焦输入框时显示" trigger="focus">
      <BiliInput placeholder="聚焦我" style="width: 180px" />
    </BiliTooltip>

    <BiliTooltip content="禁用时不会显示" disabled>
      <BiliButton>禁用提示</BiliButton>
    </BiliTooltip>

    <BiliTooltip ref="tooltipRef" content="手动控制的提示" trigger="manual">
      <BiliButton type="primary" plain @click="tooltipRef?.show()">显示提示</BiliButton>
    </BiliTooltip>

    <BiliButton @click="tooltipRef?.hide()">隐藏提示</BiliButton>
  </BiliSpace>
</template>
