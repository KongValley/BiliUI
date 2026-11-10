<script setup lang="ts">
const previewList = ['/image-demo-1.svg', '/image-demo-2.svg', '/image-demo-3.svg']
</script>

<template>
  <BiliSpace :size="16" wrap>
    <BiliImage
      v-for="(src, index) in previewList"
      :key="src"
      :src="src"
      :preview-src-list="previewList"
      :initial-index="index"
      :width="150"
      :height="100"
      fit="cover"
    />
  </BiliSpace>
</template>
