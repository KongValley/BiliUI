<script setup lang="ts">
import { BiliDialog, BiliMessage, BiliMessageBox } from 'bili-ui'

const openAlert = () => {
  BiliMessageBox.alert('当前版本已经是最新版本。', '检查更新')
}

const openConfirm = async () => {
  try {
    await BiliMessageBox.confirm('删除后无法恢复，确定删除这条记录吗？', '删除确认', {
      type: 'warning',
      confirmButtonText: '删除'
    })
    BiliMessage.success('已删除')
  } catch {
    BiliMessage.info('已取消')
  }
}

const openPrompt = async () => {
  try {
    const { value } = await BiliMessageBox.prompt('请输入项目名称', '新建项目', {
      inputValue: 'Bili UI',
      inputPattern: /\S+/,
      inputValidator: text => (text.length <= 20 ? true : '名称不能超过 20 个字符')
    })
    BiliMessage.success(`已创建：${value}`)
  } catch {
    // cancelled
  }
}

const openDialogConfirm = async () => {
  try {
    await BiliDialog.confirm('这是 BiliDialog.confirm 的同一实现。', '对话框确认')
    BiliMessage.success('已确认')
  } catch {
    // cancelled
  }
}
</script>

<template>
  <BiliSpace wrap>
    <BiliButton @click="openAlert">Alert</BiliButton>
    <BiliButton type="primary" @click="openConfirm">Confirm</BiliButton>
    <BiliButton @click="openPrompt">Prompt</BiliButton>
    <BiliButton @click="openDialogConfirm">Dialog.confirm</BiliButton>
  </BiliSpace>
</template>
