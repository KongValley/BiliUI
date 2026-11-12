<script setup lang="ts">
import { ref } from 'vue'
import type { BiliApp } from 'bili-ui'

const appRef = ref<InstanceType<typeof BiliApp> | null>(null)

const showMessage = () => {
  appRef.value?.message.success('这条消息继承了 App 上配置的默认时长')
}

const showNotification = () => {
  appRef.value?.notification.info({
    title: '构建完成',
    message: '通知使用当前 ConfigProvider 的语言与命名空间'
  })
}

const confirm = async () => {
  try {
    await appRef.value?.messageBox.confirm('确定要归档这条记录吗？', '归档确认')
    appRef.value?.message.success('已归档')
  } catch {
    // 用户取消或关闭
  }
}
</script>

<template>
  <BiliApp ref="appRef" :message="{ duration: 2500 }" class="app-demo">
    <BiliSpace wrap>
      <BiliButton type="primary" @click="showMessage">消息</BiliButton>
      <BiliButton @click="showNotification">通知</BiliButton>
      <BiliButton type="warning" @click="confirm">确认框</BiliButton>
    </BiliSpace>
  </BiliApp>
</template>

<style scoped>
.app-demo {
  padding: 16px;
  background: var(--bili-fill-color);
  border-radius: 8px;
}
</style>
