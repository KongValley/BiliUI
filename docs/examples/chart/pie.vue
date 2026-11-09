<script setup lang="ts">
const data = [
  { name: '直接访问', value: 335 },
  { name: '搜索引擎', value: 310 },
  { name: '邮件营销', value: 234 },
  { name: '联盟广告', value: 135 },
  { name: '视频广告', value: 148 }
]
</script>

<template>
  <div class="chart-grid">
    <div class="chart-cell">
      <span class="hint">饼图</span>
      <BiliPieChart :data="data" />
    </div>
    <div class="chart-cell">
      <span class="hint">环形图</span>
      <BiliPieChart :data="data" :inner-radius="0.62" />
    </div>
  </div>
</template>

<style scoped>
.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

.chart-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
