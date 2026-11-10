<script setup lang="ts">
const columns = [
  { prop: 'name', label: '项目', minWidth: 180 },
  { prop: 'owner', label: '负责人', width: 140 },
  { prop: 'stars', label: 'Stars', width: 110, align: 'right' as const }
]

const data = [
  { name: 'Bili UI', owner: 'Kong', stars: 1200, bio: '面向桌面端的 Vue 3 组件库，内置亮暗主题与完整设计令牌。' },
  { name: 'Aurora', owner: 'Chen', stars: 860, bio: '数据可视化方案，包含折线、柱状、饼图与仪表盘。' },
  { name: 'Nova', owner: 'Wang', stars: 430, bio: '中后台脚手架，内置权限、路由与请求层封装。' }
]
</script>

<template>
  <BiliTable :data="data" :columns="columns" row-key="name" expandable border>
    <template #expand="{ row }">
      <div class="detail">{{ row.bio }}</div>
    </template>
  </BiliTable>
</template>

<style scoped>
.detail {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
