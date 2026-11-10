<script setup lang="ts">
import { ref } from 'vue'

const lastCommand = ref('')

const basicItems = [
  { key: 'edit', label: '编辑', icon: 'edit' },
  { key: 'duplicate', label: '创建副本', icon: 'copy' },
  { key: 'archive', label: '归档', icon: 'inbox', shortcut: '⌘A' },
  { key: 'delete', label: '删除', icon: 'delete', divided: true },
  { key: 'frozen', label: '已冻结，无法移动', disabled: true }
]

const clickItems = [
  { key: 'view', label: '查看详情' },
  { key: 'share', label: '分享链接', shortcut: '⌘S' },
  { key: 'export', label: '导出数据', divided: true }
]

const handleCommand = (key: string) => {
  lastCommand.value = key
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace :size="24" align="center" wrap>
      <BiliDropdown :items="basicItems" trigger="hover" @command="handleCommand">
        <BiliButton plain>悬停展开</BiliButton>
      </BiliDropdown>

      <BiliDropdown :items="clickItems" trigger="click" @command="handleCommand">
        <BiliButton>点击展开</BiliButton>
      </BiliDropdown>

      <BiliDropdown :items="clickItems" trigger="click" placement="bottom-end">
        <BiliButton plain round>右下对齐</BiliButton>
      </BiliDropdown>

      <BiliDropdown :items="basicItems" trigger="click" disabled>
        <BiliButton plain disabled>禁用状态</BiliButton>
      </BiliDropdown>
    </BiliSpace>

    <div class="result">
      <span class="label">最近一次操作：</span>
      <code>{{ lastCommand || '（尚未选择）' }}</code>
    </div>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">右键触发 + 自定义面板</span>
      <div class="context-area">
        <span>在此区域右键打开菜单</span>
        <BiliDropdown trigger="contextmenu" :arrow="false">
          <template #default>
            <span class="context-trigger">右键菜单</span>
          </template>
          <template #dropdown>
            <BiliDropdownItem item-key="copy" @click="handleCommand('copy')">
              复制
            </BiliDropdownItem>
            <BiliDropdownItem item-key="paste" @click="handleCommand('paste')">
              粘贴
            </BiliDropdownItem>
            <BiliDropdownItem item-key="clear" divided @click="handleCommand('clear')">
              清除格式
            </BiliDropdownItem>
          </template>
        </BiliDropdown>
      </div>
    </BiliSpace>
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

  code {
    padding: 1px 6px;
    color: var(--bili-text-primary);
    background: var(--bili-fill-color-light);
    border-radius: 4px;
  }
}

.context-area {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 16px;
  font-size: 12px;
  color: var(--bili-text-secondary);
  background: var(--bili-bg-muted);
  border: 1px dashed var(--bili-border-color);
  border-radius: 8px;
}

.context-trigger {
  color: var(--bili-color-primary);
}
</style>
