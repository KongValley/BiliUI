<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const code = ref('')
const lastCode = ref('')
const searching = ref(false)

const handleSearch = (value: string) => {
  searching.value = true
  window.setTimeout(() => {
    searching.value = false
  }, 800)
  console.log('search', value)
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm">
      <span class="label">搜索框</span>
      <BiliInputSearch
        v-model="keyword"
        placeholder="搜索视频、番剧或用户"
        :loading="searching"
        enter-button
        style="max-width: 420px"
        @search="handleSearch"
      />
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">验证码</span>
      <BiliSpace :size="16" align="center" wrap>
        <BiliInputOtp
          v-model="code"
          :length="6"
          separator="-"
          @complete="lastCode = $event"
        />
        <span v-if="lastCode" class="hint">已输入：{{ lastCode }}</span>
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">密码遮罩</span>
      <BiliInputOtp :model-value="'1234'" :length="4" mask />
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
  color: var(--bili-color-success);
}
</style>
