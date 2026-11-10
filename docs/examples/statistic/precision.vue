<script setup lang="ts">
const formatter = (value: number | string) => `${value} ms`
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliStatistic
      title="月度预算"
      :value="1234567.891"
      :precision="2"
      prefix="¥"
      group-separator="."
      decimal-separator=","
    />
    <BiliStatistic title="平均响应时间" :value="42" :formatter="formatter" color="#52c41a" />
    <BiliStatistic :value="8" title="自定义插槽">
      <template #title>
        <span style="color: var(--bili-color-primary)">在线人数</span>
      </template>
      <template #prefix>≈</template>
      <template #suffix>人</template>
    </BiliStatistic>
  </BiliSpace>
</template>
