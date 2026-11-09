<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

const columns = [
  { prop: 'name', label: '项目', minWidth: 180, sortable: true },
  { prop: 'status', label: '状态', width: 120 },
  { prop: 'stars', label: 'Stars', width: 120, align: 'right', sortable: true },
  { prop: 'updated', label: '更新时间', width: 160 }
]

const data = [
  { name: 'Bili UI', status: 'Active', stars: 1200, updated: '2026-11-01' },
  { name: 'Aurora', status: 'Archived', stars: 860, updated: '2026-09-18' },
  { name: 'Nova', status: 'Active', stars: 430, updated: '2026-10-22' }
]

const reload = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1200)
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace>
      <BiliButton size="sm" @click="reload">模拟加载</BiliButton>
      <span class="hint">点击表头可排序，状态列使用自定义插槽渲染</span>
    </BiliSpace>

    <BiliTable :data="data" :columns="columns" :loading="loading" row-key="name">
      <template #cell-status="{ value }">
        <BiliTag :type="value === 'Active' ? 'success' : 'info'" effect="light">
          {{ value }}
        </BiliTag>
      </template>
    </BiliTable>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
