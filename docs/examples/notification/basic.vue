<script setup lang="ts">
import { BiliNotification } from 'bili-ui'

const trigger = () => {
  BiliNotification.success({
    title: '同步完成',
    message: '已成功同步 128 条记录到生产环境。'
  })
}

const triggerWarning = () => {
  BiliNotification.warning({
    title: '磁盘空间不足',
    message: '节点 node-2 的磁盘使用率已达 92%，请及时清理。',
    position: 'bottom-right'
  })
}

const triggerError = () => {
  BiliNotification.error({
    title: '部署失败',
    message: '构建阶段失败，请查看流水线日志了解详情。'
  })
}

const triggerLong = () => {
  BiliNotification.info({
    title: '需要处理',
    message: '这条通知不会自动关闭，需要手动点击右上角关闭。',
    duration: 0
  })
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace :size="12" wrap>
      <BiliButton type="primary" @click="trigger">成功通知</BiliButton>
      <BiliButton plain @click="triggerWarning">警告通知（右下）</BiliButton>
      <BiliButton type="danger" plain @click="triggerError">错误通知</BiliButton>
      <BiliButton plain @click="triggerLong">手动关闭</BiliButton>
      <BiliButton plain @click="BiliNotification.closeAll()">全部关闭</BiliButton>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">内联用法（固定在页面流中）</span>
      <BiliNotification
        title="内联通知"
        message="也可以直接把 Notification 组件放进页面布局。"
        type="info"
        :duration="0"
      />
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
