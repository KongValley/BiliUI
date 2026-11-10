<script setup lang="ts">
import { ref } from 'vue'

const active = ref(1)
const verticalActive = ref(2)
const clickable = ref(0)
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">横向步骤条</span>
      <BiliSteps :active="active">
        <BiliStep title="填写信息" description="基本信息与联系方式" />
        <BiliStep title="确认订单" description="核对商品与金额" />
        <BiliStep title="完成支付" description="选择支付方式" />
        <BiliStep title="等待发货" description="预计 24 小时内出库" />
      </BiliSteps>
      <BiliSpace :size="8">
        <BiliButton size="sm" :disabled="active === 0" @click="active--">上一步</BiliButton>
        <BiliButton size="sm" type="primary" :disabled="active === 3" @click="active++">
          下一步
        </BiliButton>
      </BiliSpace>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">错误状态 / 可点击</span>
      <BiliSteps :active="clickable" clickable @update:active="clickable = $event">
        <BiliStep title="提交申请" />
        <BiliStep title="资质审核" status="error" description="营业执照不清晰" />
        <BiliStep title="签署协议" />
        <BiliStep title="开通成功" />
      </BiliSteps>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm" fill>
      <span class="label">纵向 / 简洁模式</span>
      <BiliSpace :size="32" align="flex-start" wrap>
        <BiliSteps :active="verticalActive" direction="vertical" style="width: 220px">
          <BiliStep title="创建实例" description="选择地域与规格" />
          <BiliStep title="配置网络" description="VPC 与安全组" />
          <BiliStep title="初始化" description="安装运行时环境" />
        </BiliSteps>

        <BiliSteps :active="2" simple style="width: 320px">
          <BiliStep title="已下单" />
          <BiliStep title="已发货" />
          <BiliStep title="已签收" />
          <BiliStep title="已完成" />
        </BiliSteps>
      </BiliSpace>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
