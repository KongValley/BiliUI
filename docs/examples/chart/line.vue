<script setup lang="ts">
const categories = ['1月', '2月', '3月', '4月', '5月', '6月']

const series = [
  { name: '访问量', data: [820, 932, 901, 934, 1290, 1330] },
  { name: '下单量', data: [420, 532, 501, 654, 890, 1030], smooth: true, area: true }
]
</script>

<template>
  <BiliLineChart :categories="categories" :series="series" />
</template>
