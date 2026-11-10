<script setup lang="ts">
const events = [
  { time: '09:00', title: '提交代码', color: '#1677ff', icon: 'check', hollow: false },
  { time: '12:30', title: '代码评审', color: '#fa8c16', icon: 'message-circle', hollow: true },
  { time: '18:00', title: '合并分支', color: '#52c41a', icon: 'git-merge', hollow: false }
]
</script>

<template>
  <BiliTimeline>
    <BiliTimelineItem
      v-for="event in events"
      :key="event.time"
      :timestamp="event.time"
      :color="event.color"
      :icon="event.icon"
      :hollow="event.hollow"
    >
      {{ event.title }}
    </BiliTimelineItem>
  </BiliTimeline>
</template>
