<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <BiliButton type="primary" @click="visible = true">打开对话框</BiliButton>

  <BiliDialog v-model="visible" title="发布确认">
    <p>确定要发布这个版本吗？发布后将立即生效。</p>
    <template #footer>
      <BiliButton @click="visible = false">取消</BiliButton>
      <BiliButton type="primary" @click="visible = false">确定发布</BiliButton>
    </template>
  </BiliDialog>
</template>
