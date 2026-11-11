<script setup lang="ts">
import { ref } from 'vue'

const suffix = ref('.com')
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliSpace direction="vertical" size="sm">
      <span class="label">按钮组</span>
      <BiliSpaceCompact>
        <BiliButton>左</BiliButton>
        <BiliButton>中</BiliButton>
        <BiliButton type="primary">右</BiliButton>
      </BiliSpaceCompact>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">输入框组</span>
      <BiliSpaceCompact style="max-width: 420px">
        <BiliInput placeholder="域名" />
        <BiliSelect
          v-model="suffix"
          :options="[{ label: '.com', value: '.com' }, { label: '.cn', value: '.cn' }]"
          style="width: 110px"
        />
        <BiliButton type="primary">查询</BiliButton>
      </BiliSpaceCompact>
    </BiliSpace>

    <BiliSpace direction="vertical" size="sm">
      <span class="label">纵向</span>
      <BiliSpaceCompact direction="vertical" style="width: 200px">
        <BiliButton>第一个操作</BiliButton>
        <BiliButton>第二个操作</BiliButton>
      </BiliSpaceCompact>
    </BiliSpace>
  </BiliSpace>
</template>

<style scoped>
.label {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
