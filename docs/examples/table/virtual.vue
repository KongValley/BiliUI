<script setup lang="ts">
const columns = [
  { prop: 'id', label: 'ID', width: 90 },
  { prop: 'name', label: '任务', minWidth: 180 },
  { prop: 'owner', label: '负责人', width: 140 },
  { prop: 'email', label: '邮箱', width: 220 },
  { prop: 'status', label: '状态', width: 110 }
]

const owners = ['Alice', 'Bob', 'Carol', 'David']
const statuses = ['Active', 'Paused', 'Archived']

const data = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `任务 ${index + 1}`,
  owner: owners[index % owners.length],
  email: `user${index + 1}@bili.dev`,
  status: statuses[index % statuses.length]
}))
</script>

<template>
  <BiliTable
    :data="data"
    :columns="columns"
    row-key="id"
    virtual
    :max-height="320"
    border
  />
</template>
