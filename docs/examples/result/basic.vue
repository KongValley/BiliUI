<script setup lang="ts">
const statuses = ['success', 'info', 'warning', 'error'] as const
const codes = ['403', '404', '500'] as const
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace :size="16" wrap align="stretch">
      <div v-for="status in statuses" :key="status" class="cell">
        <BiliResult
          :status="status"
          :title="{
            success: '操作成功',
            info: '提示信息',
            warning: '存在风险',
            error: '操作失败'
          }[status]"
          sub-title="这是结果的补充说明文字，可携带更多上下文。"
        >
          <BiliButton size="sm" type="primary">返回列表</BiliButton>
          <BiliButton size="sm" plain>查看详情</BiliButton>
        </BiliResult>
      </div>
    </BiliSpace>

    <BiliSpace :size="16" wrap align="stretch">
      <div v-for="code in codes" :key="code" class="cell">
        <BiliResult
          :status="code"
          :title="{ '403': '无权访问', '404': '页面不存在', '500': '服务器错误' }[code]"
          :sub-title="{
            '403': '你没有权限查看该资源，请联系管理员。',
            '404': '页面可能已被移动或删除。',
            '500': '服务器开小差了，请稍后重试。'
          }[code]"
        >
          <BiliButton size="sm" type="primary">返回首页</BiliButton>
        </BiliResult>
      </div>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.cell {
  width: 280px;
  background: var(--bili-bg-muted);
  border: 1px solid var(--bili-border-color-light);
  border-radius: 10px;
}
</style>
