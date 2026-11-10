<script setup lang="ts">
const columns = [
  { prop: 'name', label: '姓名', width: 110, fixed: 'left' as const },
  { prop: 'department', label: '部门', width: 150 },
  { prop: 'email', label: '邮箱', width: 220 },
  { prop: 'city', label: '城市', width: 110 },
  { prop: 'joined', label: '入职日期', width: 130 },
  { prop: 'status', label: '状态', width: 100, fixed: 'right' as const }
]

const data = [
  { name: 'Alice', department: '研发中心', email: 'alice@bili.dev', city: '上海', joined: '2024-03-11', status: 'Active' },
  { name: 'Bob', department: '设计中心', email: 'bob@bili.dev', city: '杭州', joined: '2023-08-02', status: 'Active' },
  { name: 'Carol', department: '产品中心', email: 'carol@bili.dev', city: '北京', joined: '2025-01-20', status: 'Paused' },
  { name: 'David', department: '运营中心', email: 'david@bili.dev', city: '深圳', joined: '2022-11-07', status: 'Active' },
  { name: 'Eve', department: '研发中心', email: 'eve@bili.dev', city: '广州', joined: '2024-06-15', status: 'Archived' },
  { name: 'Frank', department: '财务中心', email: 'frank@bili.dev', city: '成都', joined: '2021-05-30', status: 'Active' },
  { name: 'Grace', department: '设计中心', email: 'grace@bili.dev', city: '武汉', joined: '2023-12-12', status: 'Paused' },
  { name: 'Henry', department: '研发中心', email: 'henry@bili.dev', city: '南京', joined: '2025-02-08', status: 'Active' }
]
</script>

<template>
  <BiliTable
    :data="data"
    :columns="columns"
    row-key="email"
    border
    stripe
    max-height="260"
  >
    <template #cell-status="{ value }">
      <BiliTag
        :type="value === 'Active' ? 'success' : value === 'Paused' ? 'warning' : 'info'"
        effect="light"
      >
        {{ value }}
      </BiliTag>
    </template>
  </BiliTable>
</template>
