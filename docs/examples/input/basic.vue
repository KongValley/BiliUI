<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const password = ref('bili-ui')
</script>

<template>
  <BiliSpace direction="vertical" size="lg" style="width: 360px">
    <BiliInput
      v-model="value"
      placeholder="请输入内容"
      clearable
      show-count
      :maxlength="30"
    />
    <BiliInput
      v-model="password"
      type="password"
      show-password
      placeholder="请输入密码"
    />
    <BiliInput model-value="禁用状态" disabled />
    <BiliSpace wrap>
      <BiliInput size="sm" placeholder="小号" style="width: 120px" />
      <BiliInput size="lg" placeholder="大号" style="width: 200px" />
    </BiliSpace>
    <span class="value-text">当前值：{{ value || '空' }}</span>
  </BiliSpace>
</template>

<style scoped>
.value-text {
  font-size: 13px;
  color: var(--bili-text-secondary);
}
</style>
