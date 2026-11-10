<script setup lang="ts">
const slides = [
  {
    title: '设计令牌',
    description: '三层变量体系，亮暗主题一键切换。',
    background: 'linear-gradient(135deg, #e0356b, #ff8fb1)'
  },
  {
    title: '组件能力',
    description: '从基础表单到数据可视化，覆盖中后台常见场景。',
    background: 'linear-gradient(135deg, #4f7cff, #06b6d4)'
  },
  {
    title: '类型友好',
    description: 'Props、事件与插槽均有完整 TypeScript 推导。',
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)'
  },
  {
    title: '开箱即用',
    description: '零额外依赖，按需引入或全量注册皆可。',
    background: 'linear-gradient(135deg, #0f9d76, #36cfc9)'
  }
]
</script>

<template>
  <BiliCarousel height="260px" :interval="3500">
    <BiliCarouselItem v-for="(slide, index) in slides" :key="slide.title">
      <div class="slide" :style="{ background: slide.background }">
        <span class="no">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ slide.title }}</h3>
        <p>{{ slide.description }}</p>
      </div>
    </BiliCarouselItem>
  </BiliCarousel>
</template>

<style scoped>
.slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0 56px;
  color: #fff;
}

.no {
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.32;
}

h3 {
  margin: 12px 0 8px;
  font-size: 26px;
  font-weight: 600;
}

p {
  margin: 0;
  font-size: 14px;
  opacity: 0.86;
}
</style>
