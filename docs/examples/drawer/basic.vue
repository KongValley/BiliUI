<script setup lang="ts">
import { ref } from 'vue'

type Placement = 'left' | 'right' | 'top' | 'bottom'

const visible = ref(false)
const placement = ref<Placement>('right')

const open = (value: Placement) => {
  placement.value = value
  visible.value = true
}

const title = () =>
  placement.value === 'left' || placement.value === 'right' ? '侧边抽屉' : '上下抽屉'

const size = () => (placement.value === 'left' || placement.value === 'right' ? 380 : 280)
</script>

<template>
  <BiliSpace wrap>
    <BiliButton type="primary" @click="open('right')">右侧抽屉</BiliButton>
    <BiliButton @click="open('left')">左侧抽屉</BiliButton>
    <BiliButton @click="open('top')">顶部抽屉</BiliButton>
    <BiliButton @click="open('bottom')">底部抽屉</BiliButton>
  </BiliSpace>

  <BiliDrawer v-model="visible" :title="title()" :placement="placement" :size="size()">
    <p class="drawer-text">抽屉内容区域，支持滚动、焦点锁定、ESC 关闭与遮罩点击关闭。</p>
    <p class="drawer-hint">按 Tab 键时焦点会被限制在抽屉内部，关闭后自动回到触发元素。</p>
    <template #footer>
      <BiliButton @click="visible = false">取消</BiliButton>
      <BiliButton type="primary" @click="visible = false">确定</BiliButton>
    </template>
  </BiliDrawer>
</template>

<style scoped>
.drawer-text {
  margin: 0 0 12px;
}

.drawer-hint {
  margin: 0;
  color: var(--bili-text-secondary);
}
</style>
