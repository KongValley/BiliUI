<script setup lang="ts">
const target = Date.now() + 2 * 60 * 60 * 1000 + 65 * 1000
const finish = () => {
  // 倒计时结束
}
</script>

<template>
  <BiliSpace :size="40" align="center" wrap>
    <BiliStatisticCountdown title="距离活动结束" :value="target" @finish="finish" />
    <BiliStatisticCountdown
      title="含天数格式"
      :value="target"
      format="DD:HH:mm:ss"
    />
    <BiliStatisticCountdown title="自定义颜色" :value="target" color="#e0356b" />
  </BiliSpace>
</template>
