<script setup lang="ts">
import type { TableColumn } from 'bili-ui'

const columns: TableColumn[] = [
  { prop: 'item', label: '项目', minWidth: 180 },
  { prop: 'quantity', label: '数量', width: 120, align: 'right' },
  { prop: 'price', label: '单价', width: 120, align: 'right' },
  { prop: 'amount', label: '金额', width: 140, align: 'right' }
]

const data = [
  { item: 'Bili Pro 订阅', quantity: 3, price: 99, amount: 297 },
  { item: 'Design Tokens 包', quantity: 2, price: 59, amount: 118 },
  { item: '技术支持', quantity: 1, price: 500, amount: 500 }
]

const summaryMethod = ({
  columns: cols,
  data: rows
}: {
  columns: TableColumn[]
  data: any[]
}) =>
  cols.map((column, index) => {
    if (index === 0) return '合计'
    if (column.prop === 'quantity' || column.prop === 'amount') {
      return rows.reduce((total, row) => total + Number(row[column.prop as string] || 0), 0)
    }
    return ''
  })
</script>

<template>
  <BiliTable
    :data="data"
    :columns="columns"
    row-key="item"
    show-summary
    :summary-method="summaryMethod"
    border
  />
</template>
