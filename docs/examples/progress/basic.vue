<script setup lang="ts">
import { ref } from 'vue'

const percent = ref(42)
const circlePercent = ref(68)
const uploading = ref(true)

const progress = () => {
  percent.value = Math.round(Math.random() * 100)
  circlePercent.value = Math.round(Math.random() * 100)
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">线形 / 状态色 / 区间进度</span>
      <BiliSpace direction="vertical" size="sm" fill>
        <BiliProgress :percentage="percent" />
        <BiliProgress :percentage="100" status="success" />
        <BiliProgress :percentage="60" status="warning" />
        <BiliProgress :percentage="30" status="error" />
        <BiliProgress :percentage="80" :success-percentage="55" />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">环形 / 仪表盘</span>
      <BiliSpace :size="28" wrap align="center">
        <BiliProgress type="circle" :percentage="circlePercent" />
        <BiliProgress type="circle" :percentage="circlePercent" :size="88" :stroke-width="8" />
        <BiliProgress type="dashboard" :percentage="circlePercent" :size="140" />
        <BiliProgress
          type="circle"
          :percentage="circlePercent"
          color="#8b5cf6"
          :format="value => `完成 ${value}%`"
        />
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">条纹动画 / 自定义格式</span>
      <BiliProgress
        :percentage="percent"
        :striped-animated="uploading"
        :format="value => `上传中 ${value}%`"
      />
    </BiliSpace>

    <BiliButton size="sm" @click="progress">随机进度</BiliButton>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
