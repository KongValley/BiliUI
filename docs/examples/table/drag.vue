<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { prop: 'name', label: '姓名', width: 140, sortable: true },
  { prop: 'age', label: '年龄', width: 100, align: 'center' as const, sortable: true },
  { prop: 'city', label: '城市', sortable: true },
  { prop: 'role', label: '角色' }
]

const data = [
  { name: '林青', age: 28, city: '杭州', role: '前端工程师' },
  { name: '陈默', age: 32, city: '上海', role: '产品经理' },
  { name: '苏晚', age: 26, city: '深圳', role: '交互设计师' },
  { name: '周屿', age: 35, city: '北京', role: '技术负责人' }
]

const order = ref<string[]>([])
const resize = ref<{ key: string; width: number } | null>(null)
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <span class="hint">
      拖动表头可调整列顺序，拖动表头右边界可调整列宽
    </span>

    <BiliTable
      :data="data"
      :columns="columns"
      border
      draggable-columns
      @column-order-change="order = $event"
      @column-resize="(key, width) => (resize = { key, width })"
    />

    <span class="hint">列顺序：{{ order.length ? order.join(' → ') : '未调整' }}</span>
    <span class="hint">最近调宽：{{ resize ? `${resize.key} = ${resize.width}px` : '未调整' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
