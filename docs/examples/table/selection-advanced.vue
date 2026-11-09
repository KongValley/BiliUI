<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'role', label: '角色' },
  { prop: 'status', label: '状态', width: 110 }
]

const data = [
  { id: 1, name: '林青', role: '前端工程师', status: '在职' },
  { id: 2, name: '陈默', role: '产品经理', status: '离职' },
  { id: 3, name: '苏晚', role: '交互设计师', status: '在职' },
  { id: 4, name: '周屿', role: '技术负责人', status: '在职' }
]

const selected = ref<Array<string | number>>([])
const lastEvent = ref('')

const onSelect = (payload: { keys: Array<string | number>; row?: any }) => {
  lastEvent.value = payload.row ? `选中行：${payload.row.name}` : ''
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <span class="hint">
      「离职」行不可勾选；点击整行也能切换选中状态（<code>select-on-click-row</code>）
    </span>

    <BiliTable
      v-model:selected-keys="selected"
      :data="data"
      :columns="columns"
      row-key="id"
      selection
      select-on-click-row
      :selectable="row => row.status === '在职'"
      border
      @select="onSelect"
    />

    <span class="hint">已选 key：{{ selected.join(', ') || '无' }}</span>
    <span class="hint">事件：{{ lastEvent || '—' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

code {
  padding: 1px 5px;
  font-size: 11px;
  background: var(--bili-fill-color);
  border-radius: 4px;
}
</style>
