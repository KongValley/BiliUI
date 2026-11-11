<script setup lang="ts">
const indicators = [
  { name: '播放', max: 100 },
  { name: '互动', max: 100 },
  { name: '收藏', max: 100 },
  { name: '分享', max: 100 },
  { name: '完播', max: 100 }
]

const radarSeries = [
  { name: '本周', data: [82, 64, 70, 52, 88] },
  { name: '上周', data: [65, 72, 58, 44, 76] }
]

const scatterSeries = [
  {
    name: 'A 组',
    data: [
      { x: 12, y: 30 },
      { x: 24, y: 48 },
      { x: 36, y: 26 },
      { x: 48, y: 62 },
      { x: 60, y: 44 }
    ]
  },
  {
    name: 'B 组',
    data: [
      { x: 18, y: 58 },
      { x: 30, y: 36 },
      { x: 42, y: 72 },
      { x: 54, y: 30 }
    ]
  }
]

const funnelData = [
  { name: '曝光', value: 12000 },
  { name: '点击', value: 7200 },
  { name: '播放', value: 4300 },
  { name: '互动', value: 1800 }
]
</script>

<template>
  <BiliSpace :size="32" align="start" wrap>
    <div class="chart-demo">
      <BiliRadarChart :indicators="indicators" :series="radarSeries" :height="260" />
    </div>
    <div class="chart-demo">
      <BiliScatterChart :series="scatterSeries" :height="260" />
    </div>
    <div class="chart-demo">
      <BiliFunnelChart :data="funnelData" :height="260" />
    </div>
  </BiliSpace>
</template>

<style scoped>
.chart-demo {
  width: 320px;
  padding: 12px;
  background-color: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}
</style>
