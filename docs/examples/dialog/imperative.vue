<script setup lang="ts">
import { BiliDialog, BiliMessage } from 'bili-ui'

const openConfirm = async () => {
  try {
    await BiliDialog.confirm('确定要离开当前页面吗？未保存的内容会丢失。', '离开确认')
    BiliMessage.success('已确认')
  } catch {
    BiliMessage.info('留在当前页')
  }
}

const openAlert = () => {
  BiliDialog.alert('发布成功，审核通过后将展示在首页。', '发布结果')
}
</script>

<template>
  <BiliSpace wrap>
    <BiliButton type="primary" @click="openConfirm">命令式确认</BiliButton>
    <BiliButton @click="openAlert">命令式提示</BiliButton>
  </BiliSpace>
</template>
