<script setup lang="ts">
const items = [
  { time: '2026-11-01 09:00', title: '创建项目', desc: '初始化仓库与基础工程', type: 'success' as const },
  { time: '2026-11-03 14:20', title: '完成设计', desc: '设计令牌与组件规范定稿', type: 'success' as const },
  { time: '2026-11-07 10:05', title: '联调中', desc: '与后端接口进行对接', type: 'warning' as const },
  { time: '2026-11-10 18:30', title: '准备发布', desc: '等待测试回归结果', type: 'primary' as const }
]
</script>

<template>
  <BiliTimeline>
    <BiliTimelineItem
      v-for="item in items"
      :key="item.time"
      :timestamp="item.time"
      :type="item.type"
    >
      <strong>{{ item.title }}</strong>
      <div class="desc">{{ item.desc }}</div>
    </BiliTimelineItem>
  </BiliTimeline>
</template>

<style scoped>
.desc {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
