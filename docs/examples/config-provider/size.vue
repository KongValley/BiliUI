<script setup lang="ts">
const options = [
  { label: '选项一', value: 'one' },
  { label: '选项二', value: 'two' }
]
</script>

<template>
  <BiliConfigProvider size="sm">
    <BiliSpace align="center" wrap :size="12">
      <BiliButton type="primary">小尺寸按钮</BiliButton>
      <BiliInput placeholder="小尺寸输入框" style="width: 160px" />
      <BiliSelect :options="options" placeholder="选择" style="width: 140px" />
    </BiliSpace>
  </BiliConfigProvider>
</template>
