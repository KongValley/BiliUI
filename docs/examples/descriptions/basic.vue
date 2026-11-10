<script setup lang="ts">
const order = [
  { label: '订单号', value: 'BL20261110001' },
  { label: '下单时间', value: '2026-11-10 09:24' },
  { label: '订单状态', value: '已发货' },
  { label: '支付方式', value: '微信支付' },
  { label: '收货人', value: '张三' },
  { label: '联系电话', value: '138****8888' },
  { label: '收货地址', value: '上海市浦东新区世纪大道 100 号 B 座 2201 室', span: 3 }
]
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">基础用法（3 列）</span>
      <BiliDescriptions title="订单信息">
        <BiliDescriptionsItem
          v-for="item in order"
          :key="item.label"
          :label="item.label"
          :span="item.span ?? 1"
        >
          {{ item.value }}
        </BiliDescriptionsItem>
      </BiliDescriptions>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">带边框 / 2 列</span>
      <BiliDescriptions :column="2" bordered label-width="100">
        <BiliDescriptionsItem
          v-for="item in order.slice(0, 6)"
          :key="item.label"
          :label="item.label"
        >
          {{ item.value }}
        </BiliDescriptionsItem>
        <BiliDescriptionsItem label="收货地址" :span="2">
          上海市浦东新区世纪大道 100 号 B 座 2201 室
        </BiliDescriptionsItem>
      </BiliDescriptions>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">垂直布局</span>
      <BiliDescriptions :column="4" direction="vertical" bordered>
        <BiliDescriptionsItem
          v-for="item in order.slice(0, 4)"
          :key="item.label"
          :label="item.label"
        >
          {{ item.value }}
        </BiliDescriptionsItem>
      </BiliDescriptions>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
