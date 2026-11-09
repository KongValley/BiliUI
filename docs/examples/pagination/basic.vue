<script setup lang="ts">
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliPagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="126"
    />
    <span class="value-text">第 {{ page }} 页，每页 {{ pageSize }} 条</span>
  </BiliSpace>
</template>

<style scoped>
.value-text {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
