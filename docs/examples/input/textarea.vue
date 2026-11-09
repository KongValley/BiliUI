<script setup lang="ts">
import { ref } from 'vue'

const description = ref('')
</script>

<template>
  <BiliSpace direction="vertical" size="lg" style="width: 420px">
    <BiliInput
      v-model="description"
      type="textarea"
      :rows="4"
      placeholder="请输入项目描述"
      show-count
      :maxlength="200"
    />
    <BiliInput placeholder="搜索组件">
      <template #prefix>
        <BiliIcon name="search" />
      </template>
      <template #suffix>
        <BiliTag type="primary" effect="plain" size="sm">⌘ K</BiliTag>
      </template>
    </BiliInput>
  </BiliSpace>
</template>
