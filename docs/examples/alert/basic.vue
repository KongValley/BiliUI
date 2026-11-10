<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
const bannerVisible = ref(true)
</script>

<template>
  <BiliSpace direction="vertical" size="md" fill>
    <BiliAlert title="普通信息提示" type="info" show-icon />
    <BiliAlert title="操作成功" description="数据已保存，将于 5 分钟后同步。" type="success" show-icon />
    <BiliAlert
      title="存储空间即将用尽"
      description="当前已使用 92%，请及时清理或升级套餐。"
      type="warning"
      show-icon
      bordered
    />
    <BiliAlert
      title="请求失败"
      description="服务暂时不可用，请稍后重试。"
      type="error"
      show-icon
      bordered
      closable
    />

    <BiliAlert v-model:visible="visible" title="可关闭提示" type="info" closable show-icon>
      <template #action>
        <BiliButton size="sm" plain>查看详情</BiliButton>
      </template>
    </BiliAlert>

    <BiliSpace v-if="!visible" align="center">
      <span class="hint">提示已关闭</span>
    </BiliSpace>

    <BiliAlert
      v-model:visible="bannerVisible"
      type="warning"
      show-icon
      bordered
      closable
      title="系统将于今晚 23:00 进行维护"
    >
      <template #action>
        <BiliButton size="sm" type="warning" @click="bannerVisible = false">我知道了</BiliButton>
      </template>
    </BiliAlert>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
