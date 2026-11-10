<script setup lang="ts">
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: '标签一', closable: false },
  { name: 'two', label: '标签二', closable: true },
  { name: 'three', label: '标签三', closable: true }
])

const remove = (name: string) => {
  panes.value = panes.value.filter(pane => pane.name !== name)
  if (active.value === name && panes.value.length) active.value = panes.value[0].name
}

const loading = ref(true)
setTimeout(() => {
  loading.value = false
}, 1600)
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">可关闭标签 / 右侧操作区 / 懒加载</span>
      <BiliTabs v-model="active" closable lazy @tab-remove="remove">
        <template #extra>
          <BiliButton size="sm" type="primary">新建</BiliButton>
        </template>
        <BiliTabPane
          v-for="pane in panes"
          :key="pane.name"
          :name="pane.name"
          :label="pane.label"
          :closable="pane.closable"
        >
          <div class="panel">{{ pane.label }} 的内容（首次切换才挂载）</div>
        </BiliTabPane>
      </BiliTabs>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">骨架屏切换</span>
      <BiliTabs v-model="active">
        <BiliTabPane name="one" label="加载中">
          <BiliSkeleton :loading="loading" :rows="3" avatar animated>
            <p class="loaded">内容已加载完成。</p>
          </BiliSkeleton>
        </BiliTabPane>
        <BiliTabPane name="two" label="内容">
          <p class="loaded">第二个面板</p>
        </BiliTabPane>
      </BiliTabs>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.panel {
  padding: 12px 0;
  color: var(--bili-text-regular);
}

.loaded {
  margin: 0;
  color: var(--bili-text-regular);
}
</style>
