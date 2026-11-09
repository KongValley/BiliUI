<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { prop: 'team', label: '分组', width: 100, sortable: true },
  { prop: 'name', label: '成员', width: 140, sortable: true },
  { prop: 'score', label: '得分', width: 100, align: 'center' as const, sortable: true },
  { prop: 'level', label: '等级', width: 100, align: 'center' as const }
]

const data = [
  { team: 'A', name: '林青', score: 92, level: 'P6' },
  { team: 'B', name: '陈默', score: 88, level: 'P5' },
  { team: 'A', name: '苏晚', score: 95, level: 'P7' },
  { team: 'B', name: '周屿', score: 79, level: 'P4' },
  { team: 'A', name: '何舟', score: 88, level: 'P5' }
]

const lastEvent = ref('')

const onSortChange = (payload: { sorts: Array<{ prop: string; order: string }> }) => {
  lastEvent.value = payload.sorts.length
    ? payload.sorts.map(item => `${item.prop} ${item.order === 'asc' ? '↑' : '↓'}`).join('，')
    : '已取消排序'
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <span class="hint">
      点击表头切换升序 / 降序 / 取消；按住 <code>Shift</code> 点击可叠加多列排序，表头显示优先级序号
    </span>

    <BiliTable
      :data="data"
      :columns="columns"
      border
      stripe
      multi-sort
      @sort-change="onSortChange"
    />

    <span class="hint">当前排序：{{ lastEvent || '未排序' }}</span>
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
