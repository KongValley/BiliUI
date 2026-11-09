<script setup lang="ts">
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(20)
const small = ref(false)
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliPagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="1260"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :small="small"
    />

    <BiliSpace>
      <BiliSwitch v-model="small" active-text="紧凑" inactive-text="默认" />
      <span class="value-text">
        第 {{ page }} 页 · 每页 {{ pageSize }} 条 · 共 {{ Math.ceil(1260 / pageSize) }} 页
      </span>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.value-text {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
