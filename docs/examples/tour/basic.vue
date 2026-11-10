<script setup lang="ts">
import { ref } from 'vue'

const current = ref(-1)
const keyword = ref('')

const steps = [
  {
    target: '#tour-demo-start',
    title: '开始引导',
    description: '点击「开始引导」可以随时重新打开这段引导。',
    placement: 'bottom' as const
  },
  {
    target: '#tour-demo-card',
    title: '功能卡片',
    description: '引导会高亮目标区域，并用遮罩隔开页面其他内容。',
    placement: 'top' as const
  },
  {
    target: '#tour-demo-input',
    title: '输入区域',
    description: '最后一步，点击「完成」结束引导。',
    placement: 'bottom' as const
  }
]

const open = () => {
  current.value = 0
}
</script>

<template>
  <div class="tour-demo">
    <BiliSpace align="center" wrap>
      <BiliButton id="tour-demo-start" type="primary" @click="open">开始引导</BiliButton>
      <BiliInput
        id="tour-demo-input"
        v-model="keyword"
        placeholder="输入关键词"
        style="width: 180px"
      />
    </BiliSpace>
    <div id="tour-demo-card" class="card">
      <h4>引导目标</h4>
      <p>这里是第二步高亮的卡片内容。</p>
    </div>
  </div>

  <BiliTour v-model="current" :steps="steps" />
</template>

<style scoped>
.tour-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

.card {
  padding: 18px 20px;
  background-color: var(--bili-bg-muted);
  border: 1px dashed var(--bili-border-color);
  border-radius: var(--bili-radius-md);
}

h4 {
  margin: 0 0 6px;
  font-size: 15px;
  color: var(--bili-text-primary);
}

p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}
</style>
