<script setup lang="ts">
const lines = Array.from(
  { length: 6 },
  (_, index) => `向下滚动页面，按钮会一直吸附在距离顶部 80px 的位置（第 ${index + 1} 段说明）。`
)
</script>

<template>
  <div class="affix-demo">
    <p>固钉区域：滚动文档页面查看效果，按钮在到达 80px 偏移前保持正常文档流。</p>
    <BiliAffix :offset="80">
      <BiliButton type="primary">固定的操作按钮</BiliButton>
    </BiliAffix>
    <div class="filler">
      <p v-for="line in lines" :key="line">{{ line }}</p>
    </div>
  </div>
</template>

<style scoped>
.affix-demo {
  padding: 8px;
  background-color: var(--bili-bg-container);
  border: 1px solid var(--bili-border-color-light);
  border-radius: var(--bili-radius-md);
}

.affix-demo > p,
.filler p {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--bili-text-secondary);
}

.filler {
  padding-top: 16px;
}
</style>
