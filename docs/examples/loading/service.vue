<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BiliLoading } from 'bili-ui'

const instance = ref<ReturnType<typeof BiliLoading.service> | null>(null)

const open = () => {
  instance.value?.close()
  instance.value = BiliLoading.service({ text: '数据同步中…' })
  window.setTimeout(() => {
    instance.value?.close()
    instance.value = null
  }, 1600)
}

onBeforeUnmount(() => instance.value?.close())
</script>

<template>
  <BiliButton type="primary" @click="open">打开全屏 Loading</BiliButton>
</template>
