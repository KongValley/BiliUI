<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

const simulate = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1200)
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace wrap>
      <BiliButton plain>朴素</BiliButton>
      <BiliButton type="primary" plain>朴素主要</BiliButton>
      <BiliButton round>圆角</BiliButton>
      <BiliButton type="primary" round>圆角主要</BiliButton>
      <BiliButton type="primary" circle icon="plus" aria-label="新增" />
    </BiliSpace>

    <BiliSpace wrap>
      <BiliButton size="sm">小号</BiliButton>
      <BiliButton>中号</BiliButton>
      <BiliButton size="lg">大号</BiliButton>
    </BiliSpace>

    <BiliSpace wrap>
      <BiliButton type="primary" :loading="loading" @click="simulate">
        {{ loading ? '提交中' : '点击加载' }}
      </BiliButton>
      <BiliButton disabled>禁用</BiliButton>
      <BiliButton type="danger" plain>删除</BiliButton>
      <BiliButton icon="search">搜索</BiliButton>
    </BiliSpace>

    <BiliButton type="primary" block>块级按钮</BiliButton>
  </BiliSpace>
</template>
