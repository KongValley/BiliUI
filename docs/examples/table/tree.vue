<script setup lang="ts">
const columns = [
  { prop: 'name', label: '组织 / 成员', minWidth: 260 },
  { prop: 'owner', label: '负责人', width: 140 },
  { prop: 'count', label: '人数', width: 100, align: 'right' as const }
]

const data = [
  {
    id: 1,
    name: '研发中心',
    owner: 'Kong',
    count: 42,
    children: [
      { id: 11, name: '平台组', owner: 'Alice', count: 18 },
      {
        id: 12,
        name: '应用组',
        owner: 'Bob',
        count: 24,
        children: [
          { id: 121, name: 'B 端', owner: 'Carol', count: 15 },
          { id: 122, name: 'C 端', owner: 'David', count: 9 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '设计中心',
    owner: 'Eve',
    count: 16,
    children: [
      { id: 21, name: '体验设计', owner: 'Frank', count: 9 },
      { id: 22, name: '视觉设计', owner: 'Grace', count: 7 }
    ]
  },
  { id: 3, name: '产品中心', owner: 'Henry', count: 12 }
]
</script>

<template>
  <BiliTable
    :data="data"
    :columns="columns"
    row-key="id"
    default-expand-all
    border
  />
</template>
