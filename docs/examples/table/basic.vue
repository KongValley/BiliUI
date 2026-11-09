<script setup lang="ts">
const columns = [
  { prop: 'name', label: '姓名', width: 160 },
  { prop: 'age', label: '年龄', width: 100, align: 'center' },
  { prop: 'city', label: '城市' },
  { prop: 'role', label: '角色' }
]

const data = [
  { name: '林青', age: 28, city: '杭州', role: '前端工程师' },
  { name: '陈默', age: 32, city: '上海', role: '产品经理' },
  { name: '苏晚', age: 26, city: '深圳', role: '交互设计师' },
  { name: '周屿', age: 35, city: '北京', role: '技术负责人' }
]
</script>

<template>
  <BiliTable :data="data" :columns="columns" border stripe />
</template>
