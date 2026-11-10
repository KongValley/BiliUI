<script setup lang="ts">
import { ref } from 'vue'

const active = ref('overview')
const cardActive = ref('a')
const verticalActive = ref('profile')

const tabItems = [
  { name: 'overview', label: '概览', icon: 'home' },
  { name: 'analysis', label: '数据分析', icon: 'chart' },
  { name: 'settings', label: '设置', icon: 'settings' },
  { name: 'archived', label: '已归档', disabled: true }
]
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">下划线模式</span>
      <BiliTabs v-model="active">
        <BiliTabPane
          v-for="item in tabItems"
          :key="item.name"
          :name="item.name"
          :label="item.label"
          :icon="item.icon"
          :disabled="item.disabled"
        >
          <div class="panel">{{ item.label }} 的内容区域</div>
        </BiliTabPane>
      </BiliTabs>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">卡片模式 / 分段控件</span>
      <BiliSpace align="flex-start" :size="16" wrap>
        <BiliTabs v-model="cardActive" type="card" style="width: 380px">
          <BiliTabPane name="a" label="基础信息">基础信息面板</BiliTabPane>
          <BiliTabPane name="b" label="权限配置">权限配置面板</BiliTabPane>
          <BiliTabPane name="c" label="操作日志">操作日志面板</BiliTabPane>
        </BiliTabs>

        <BiliTabs v-model="cardActive" type="segment" style="width: 280px">
          <BiliTabPane name="a" label="日">日视图</BiliTabPane>
          <BiliTabPane name="b" label="周">周视图</BiliTabPane>
          <BiliTabPane name="c" label="月">月视图</BiliTabPane>
        </BiliTabs>
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">纵向模式</span>
      <BiliTabs v-model="verticalActive" direction="vertical" style="min-height: 160px">
        <BiliTabPane name="profile" label="个人资料">个人资料面板</BiliTabPane>
        <BiliTabPane name="security" label="安全设置">安全设置面板</BiliTabPane>
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
</style>
