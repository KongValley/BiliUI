<script setup lang="ts">
import { ref } from 'vue'

interface Option {
  label: string
  value: string
}

const database: Option[] = [
  { label: 'Alice Chen', value: 'alice' },
  { label: 'Bob Li', value: 'bob' },
  { label: 'Carol Wang', value: 'carol' },
  { label: 'David Zhao', value: 'david' },
  { label: 'Eve Liu', value: 'eve' }
]

const options = ref<Option[]>([])
const loading = ref(false)
const value = ref<string | number | null>(null)

const remoteMethod = (query: string) => {
  loading.value = true
  window.setTimeout(() => {
    options.value = database.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase())
    )
    loading.value = false
  }, 400)
}
</script>

<template>
  <BiliSelect
    v-model="value"
    :options="options"
    :loading="loading"
    filterable
    remote
    clearable
    :remote-method="remoteMethod"
    placeholder="输入姓名搜索"
    style="width: 320px"
  />
</template>
