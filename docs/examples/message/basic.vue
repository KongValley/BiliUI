<script setup lang="ts">
import { BiliMessage } from 'bili-ui'
</script>

<template>
  <BiliSpace wrap>
    <BiliButton @click="BiliMessage.success('操作成功')">成功</BiliButton>
    <BiliButton @click="BiliMessage.warning('请注意检查输入内容')">警告</BiliButton>
    <BiliButton @click="BiliMessage.error('操作失败，请稍后重试')">错误</BiliButton>
    <BiliButton @click="BiliMessage.info('这是一条信息提示')">信息</BiliButton>
  </BiliSpace>
</template>
