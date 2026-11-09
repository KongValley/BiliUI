<script setup lang="ts">
const categories = ['华东', '华北', '华南', '西南', '东北']

const grouped = [
  { name: '线上', data: [320, 240, 180, 120, 90] },
  { name: '线下', data: [180, 160, 140, 90, 60] }
]

const stacked = [
  { name: '新增', data: [120, 100, 80, 60, 40], stack: 'total' },
  { name: '续费', data: [80, 70, 60, 50, 30], stack: 'total' }
]
</script>

<template>
  <div class="chart-grid">
    <div class="chart-cell">
      <span class="hint">分组柱状图</span>
      <BiliBarChart :categories="categories" :series="grouped" />
    </div>
    <div class="chart-cell">
      <span class="hint">堆叠柱状图</span>
      <BiliBarChart :categories="categories" :series="stacked" stacked />
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
