<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const users = [
  { id: 1, name: '林晞', role: '前端工程师' },
  { id: 2, name: '陈屿', role: '产品经理' },
  { id: 3, name: '周野', role: '设计师' }
]
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">基础列表</span>
      <BiliList :data="users" row-key="id" header="团队成员" footer="共 3 人">
        <template #default="{ item }">
          <div class="member">
            <span class="member__name">{{ item.name }}</span>
            <span class="member__role">{{ item.role }}</span>
          </div>
        </template>
      </BiliList>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">悬停 / 加载状态</span>
      <BiliList :data="users" row-key="id" bordered hoverable :loading="loading" />
      <BiliButton size="sm" @click="loading = !loading">
        {{ loading ? '结束加载' : '切换加载' }}
      </BiliButton>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}

.member {
  display: flex;
  gap: 10px;
  align-items: baseline;
  justify-content: space-between;
}

.member__name {
  font-weight: var(--bili-font-weight-medium);
  color: var(--bili-text-primary);
}

.member__role {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
