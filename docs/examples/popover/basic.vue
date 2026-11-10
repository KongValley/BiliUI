<script setup lang="ts">
import { ref } from 'vue'

const popoverVisible = ref(false)
const confirmResult = ref('')

const deleting = () => new Promise<void>(resolve => setTimeout(resolve, 900))

const onConfirm = async () => {
  await deleting()
  confirmResult.value = '已删除'
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace :size="16" align="center" wrap>
      <BiliPopover title="筛选条件" content="支持按时间、状态与关键字筛选。">
        <BiliButton plain>悬停查看</BiliButton>
      </BiliPopover>

      <BiliPopover trigger="hover" placement="right" title="权限说明">
        <template #content>
          <p style="margin: 0">管理员可以编辑所有字段，普通成员只能编辑自己创建的记录。</p>
        </template>
        <BiliButton plain>富内容</BiliButton>
      </BiliPopover>

      <BiliPopover v-model:visible="popoverVisible" trigger="click" title="受控弹层">
        <template #content>
          <BiliSpace direction="vertical" size="sm" fill>
            <span>这是一个受控的弹出层。</span>
            <BiliButton size="sm" @click="popoverVisible = false">关闭</BiliButton>
          </BiliSpace>
        </template>
        <BiliButton>点击展开</BiliButton>
      </BiliPopover>
    </BiliSpace>

    <BiliSpace :size="16" align="center" wrap>
      <BiliPopconfirm content="确定要删除这条记录吗？" @confirm="confirmResult = '已删除'">
        <BiliButton type="danger" plain>删除（同步）</BiliButton>
      </BiliPopconfirm>

      <BiliPopconfirm
        content="删除后不可恢复，确认继续？"
        confirm-text="确认删除"
        confirm-type="danger"
        :on-confirm="onConfirm"
      >
        <BiliButton type="danger">删除（异步）</BiliButton>
      </BiliPopconfirm>

      <BiliPopconfirm
        content="提交后将进入审核流程。"
        confirm-text="提交"
        cancel-text="再想想"
        @confirm="confirmResult = '已提交'"
      >
        <BiliButton type="primary">提交审批</BiliButton>
      </BiliPopconfirm>
    </BiliSpace>

    <div class="result">
      <span class="label">操作结果：</span>
      <code>{{ confirmResult || '（尚未操作）' }}</code>
    </div>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.result {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  color: var(--bili-text-secondary);
}

code {
  padding: 1px 6px;
  color: var(--bili-text-primary);
  background: var(--bili-fill-color-light);
  border-radius: 4px;
}
</style>
