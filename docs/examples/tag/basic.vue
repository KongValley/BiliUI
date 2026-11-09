<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['设计', '前端', 'Vue 3'])
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace wrap>
      <BiliTag>默认标签</BiliTag>
      <BiliTag type="primary">主要</BiliTag>
      <BiliTag type="success">成功</BiliTag>
      <BiliTag type="warning">警告</BiliTag>
      <BiliTag type="danger">危险</BiliTag>
      <BiliTag type="info">信息</BiliTag>
    </BiliSpace>

    <BiliSpace wrap>
      <BiliTag type="primary" effect="dark">dark</BiliTag>
      <BiliTag type="success" effect="dark">dark</BiliTag>
      <BiliTag type="danger" effect="dark">dark</BiliTag>
      <BiliTag type="primary" effect="plain">plain</BiliTag>
      <BiliTag type="success" effect="plain" round>圆角 plain</BiliTag>
      <BiliTag type="warning" size="sm">小号</BiliTag>
      <BiliTag type="warning" size="lg">大号</BiliTag>
    </BiliSpace>

    <BiliSpace wrap>
      <BiliTag
        v-for="tag in tags"
        :key="tag"
        type="primary"
        closable
        @close="tags = tags.filter(item => item !== tag)"
      >
        {{ tag }}
      </BiliTag>
      <BiliTag v-if="!tags.length" type="info" effect="plain">已全部关闭</BiliTag>
    </BiliSpace>
  </BiliSpace>
</template>
