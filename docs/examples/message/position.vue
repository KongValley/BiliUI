<script setup lang="ts">
import { BiliMessage } from 'bili-ui'

const positions = [
  { key: 'top', label: '顶部居中' },
  { key: 'top-left', label: '左上角' },
  { key: 'top-right', label: '右上角' },
  { key: 'bottom', label: '底部居中' },
  { key: 'bottom-left', label: '左下角' },
  { key: 'bottom-right', label: '右下角' }
] as const

const show = (position: (typeof positions)[number]['key']) => {
  BiliMessage({
    message: `来自「${positions.find(item => item.key === position)?.label}」的消息`,
    type: 'success',
    position,
    duration: 2500
  })
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <span class="hint">同一时刻可以同时存在 6 个位置的消息栈，互不干扰</span>

    <BiliSpace wrap>
      <BiliButton
        v-for="item in positions"
        :key="item.key"
        size="sm"
        @click="show(item.key)"
      >
        {{ item.label }}
      </BiliButton>
    </BiliSpace>

    <BiliSpace wrap>
      <BiliButton type="primary" size="sm" @click="show('bottom-right')">
        右下角（常用于操作反馈）
      </BiliButton>
      <BiliButton
        size="sm"
        @click="BiliMessage.closeAll('bottom-right')"
      >
        只关闭右下角
      </BiliButton>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
