<script setup lang="ts">
import { ref } from 'vue'

const custom = ref(false)
const wide = ref(false)
</script>

<template>
  <BiliSpace wrap>
    <BiliButton @click="custom = true">自定义头部</BiliButton>
    <BiliButton @click="wide = true">宽屏对话框</BiliButton>
  </BiliSpace>

  <BiliDialog v-model="custom" width="420px" :show-close="false">
    <template #header>
      <span class="custom-title">自定义标题</span>
    </template>
    <p>通过 header 插槽自定义头部，同时隐藏默认关闭按钮。</p>
    <template #footer>
      <BiliButton type="primary" @click="custom = false">知道了</BiliButton>
    </template>
  </BiliDialog>

  <BiliDialog v-model="wide" title="宽屏对话框" width="720px" top="10vh">
    <p>宽度支持数字与字符串，top 控制对话框距离顶部的距离。</p>
    <p>按下 Esc、点击遮罩或右上角关闭按钮均可关闭。</p>
  </BiliDialog>
</template>

<style scoped>
.custom-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--bili-color-primary);
}
</style>
