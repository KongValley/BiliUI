<script setup lang="ts">
const statuses = [
  { status: 'success', label: '运行中' },
  { status: 'processing', label: '部署中' },
  { status: 'default', label: '已停止' },
  { status: 'warning', label: '告警' },
  { status: 'error', label: '失败' }
] as const
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace :size="24" align="center" wrap>
      <BiliBadge :value="5">
        <BiliAvatar name="张三" shape="square" size="lg" />
      </BiliBadge>
      <BiliBadge :value="120">
        <BiliAvatar icon="user" shape="square" size="lg" />
      </BiliBadge>
      <BiliBadge :value="120" :max="99">
        <BiliAvatar name="JD" shape="square" size="lg" />
      </BiliBadge>
      <BiliBadge dot>
        <BiliAvatar name="王小明" shape="square" size="lg" />
      </BiliBadge>
      <BiliBadge value="NEW" type="primary">
        <BiliAvatar name="AB" shape="square" size="lg" />
      </BiliBadge>
    </BiliSpace>

    <BiliSpace :size="16" align="center" wrap>
      <BiliBadge :value="8" />
      <BiliBadge :value="8" type="primary" />
      <BiliBadge :value="8" type="success" />
      <BiliBadge :value="8" type="warning" />
      <BiliBadge :value="0" show-zero />
      <BiliBadge dot type="success" />
    </BiliSpace>

    <BiliSpace :size="20" align="center" wrap>
      <BiliBadge
        v-for="item in statuses"
        :key="item.status"
        :status="item.status"
      >
        {{ item.label }}
      </BiliBadge>
    </BiliSpace>
  </BiliSpace>
</template>
