<script setup lang="ts">
const lines = Array.from({ length: 5 }, (_, index) => `底部固钉示例段落 ${index + 1}`)
</script>

<template>
  <div class="affix-demo">
    <p>position 设为 bottom 后，元素在接近视口底部时吸附，并保持在容器范围内。</p>
    <BiliAffix :offset="24" position="bottom">
      <BiliButton plain>底部固钉</BiliButton>
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
