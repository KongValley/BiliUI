<script setup lang="ts">
const slides = [
  { title: '纵向轮播', description: 'direction 切换为 vertical。', background: '#1f2329' },
  { title: '常驻箭头', description: 'arrow 设为 always。', background: '#2b3140' },
  { title: '指示器外置', description: 'indicator-position 设为 outside。', background: '#343b4c' }
]
</script>

<template>
  <BiliCarousel
    height="240px"
    direction="vertical"
    :autoplay="false"
    arrow="always"
    indicator-position="outside"
  >
    <BiliCarouselItem v-for="slide in slides" :key="slide.title">
      <div class="slide" :style="{ background: slide.background }">
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
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
}

h3 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
}

p {
  margin: 0;
  font-size: 13px;
  opacity: 0.72;
}
</style>
