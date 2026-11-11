<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const city = ref('')
const cities = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '武汉',
  '西安'
]
const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Apricot', value: 'apricot' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Cherry', value: 'cherry' }
]

const fetchCities = (query: string) =>
  new Promise<string[]>(resolve => {
    setTimeout(() => {
      resolve(cities.filter(city => city.includes(query.trim())))
    }, 350)
  })
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">本地过滤</span>
      <BiliAutoComplete
        v-model="value"
        :options="fruits"
        placeholder="输入 A 试试"
        clearable
        style="max-width: 280px"
      />
      <span class="hint">当前值：{{ value || '（空）' }}</span>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">异步建议</span>
      <BiliAutoComplete
        v-model="city"
        :options="[]"
        :fetch-suggestions="fetchCities"
        :debounce="250"
        placeholder="输入城市名称"
        style="max-width: 280px"
      />
      <span class="hint">当前值：{{ city || '（空）' }}</span>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.hint {
  font-size: 12px;
  color: var(--bili-text-placeholder);
}
</style>
