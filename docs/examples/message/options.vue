<script setup lang="ts">
import { BiliMessage } from 'bili-ui'

const showCountdown = () => {
  BiliMessage({
    message: '这条消息会在 5 秒后自动关闭，指上去可暂停倒计时',
    type: 'success',
    duration: 5000,
    showClose: true
  })
}

const showNoProgress = () => {
  BiliMessage({
    message: '关闭了进度条，只按时间关闭',
    type: 'info',
    duration: 4000,
    showProgress: false
  })
}

const showNoPause = () => {
  BiliMessage({
    message: '悬停不会暂停倒计时',
    type: 'warning',
    duration: 3000,
    pauseOnHover: false
  })
}

const showPermanent = () => {
  BiliMessage({
    message: '这是一条不会自动关闭的消息',
    type: 'info',
    duration: 0,
    showClose: true
  })
}
</script>

<template>
  <BiliSpace wrap>
    <BiliButton type="primary" @click="showCountdown">5 秒倒计时</BiliButton>
    <BiliButton @click="showNoProgress">无进度条</BiliButton>
    <BiliButton @click="showNoPause">悬停不暂停</BiliButton>
    <BiliButton @click="showPermanent">常驻消息</BiliButton>
    <BiliButton @click="BiliMessage.closeAll()">全部关闭</BiliButton>
  </BiliSpace>
</template>
