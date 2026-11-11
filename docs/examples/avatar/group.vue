<script setup lang="ts">
const names = ['张三', '李四', '王五', '赵六', '钱七']
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliSpace direction="vertical" size="sm">
      <span class="label">最多展示 4 个</span>
      <BiliAvatarGroup :max="4" size="lg">
        <BiliAvatar v-for="name in names" :key="name" :name="name" />
      </BiliAvatarGroup>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">方形与自定义重叠</span>
      <BiliAvatarGroup shape="square" :spacing="-12">
        <BiliAvatar v-for="name in names.slice(0, 3)" :key="name" :name="name" />
      </BiliAvatarGroup>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
