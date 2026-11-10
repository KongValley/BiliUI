<script setup lang="ts">
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace :size="16" align="center" wrap>
      <BiliAvatar src="/avatar-1.svg" alt="Bili 用户" size="lg" />
      <BiliAvatar name="张三" size="lg" />
      <BiliAvatar name="John Doe" size="lg" />
      <BiliAvatar name="王小明" size="lg" />
      <BiliAvatar icon="user" size="lg" />
      <BiliAvatar src="/avatar-2.svg" alt="方形头像" shape="square" size="lg" />
      <BiliAvatar name="边框" size="lg" bordered />
    </BiliSpace>

    <BiliSpace :size="16" align="center" wrap>
      <BiliAvatar v-for="size in sizes" :key="size" :size="size" :name="size.toUpperCase()" />
      <BiliAvatar :size="48" name="48" />
      <BiliAvatar src="data:image/png;base64,AAAA" name="加载失败" size="lg" />
      <BiliAvatar size="lg">
        <span style="font-size: 11px; font-weight: 600">VIP</span>
      </BiliAvatar>
    </BiliSpace>
  </BiliSpace>
</template>
