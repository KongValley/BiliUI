<script setup lang="ts">
import { ref } from 'vue'

const panes = ref([
  { name: 'one', label: '标签 1' },
  { name: 'two', label: '标签 2' }
])
const active = ref('one')
let seed = 3

const handleAdd = () => {
  const name = `tab-${seed}`
  panes.value.push({ name, label: `标签 ${seed}` })
  seed += 1
  active.value = name
}

const handleRemove = (name: string | number) => {
  panes.value = panes.value.filter(pane => pane.name !== name)
  if (active.value === name) active.value = panes.value[0]?.name ?? ''
}
</script>

<template>
  <BiliTabs
    v-model="active"
    type="card"
    closable
    addable
    @add="handleAdd"
    @tab-remove="handleRemove"
  >
    <BiliTabPane v-for="pane in panes" :key="pane.name" :name="pane.name" :label="pane.label">
      {{ pane.label }} 的内容
    </BiliTabPane>
  </BiliTabs>
</template>
