<script setup lang="ts">
const stats = [
  { title: '总销售额', value: 126560, prefix: '¥' },
  { title: '活跃用户', value: 8846, suffix: '人' },
  { title: '转化率', value: 92.3, precision: 1, suffix: '%' },
  { title: '退款金额', value: -1234.5, prefix: '¥' }
]
</script>

<template>
  <BiliSpace :size="32" wrap>
    <BiliStatistic
      v-for="stat in stats"
      :key="stat.title"
      :title="stat.title"
      :value="stat.value"
      :prefix="stat.prefix"
      :suffix="stat.suffix"
      :precision="stat.precision"
    />
  </BiliSpace>
</template>
