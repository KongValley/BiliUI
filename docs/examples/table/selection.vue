<script setup lang="ts">
import { computed, ref } from 'vue'

const columns = [
  { prop: 'name', label: '姓名', width: 140 },
  { prop: 'age', label: '年龄', width: 100, align: 'center' as const, sortable: true },
  { prop: 'city', label: '城市', sortable: true }
]

const data = [
  { id: 1, name: '林青', age: 28, city: '杭州' },
  { id: 2, name: '陈默', age: 32, city: '上海' },
  { id: 3, name: '苏晚', age: 26, city: '深圳' },
  { id: 4, name: '周屿', age: 35, city: '北京' }
]

const selected = ref<Array<string | number>>([])

const selectedNames = computed(() =>
  data.filter(row => selected.value.includes(row.id)).map(row => row.name)
)

const clear = () => {
  selected.value = []
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace wrap>
      <BiliButton size="sm" :disabled="!selected.length" @click="clear">
        清空选择
      </BiliButton>
      <span class="hint">已选 {{ selected.length }} 项：{{ selectedNames.join('、') || '无' }}</span>
    </BiliSpace>

    <BiliTable
      v-model:selected-keys="selected"
      :data="data"
      :columns="columns"
      row-key="id"
      selection
      border
      stripe
    />
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
