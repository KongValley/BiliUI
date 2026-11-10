<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | number | null>('hangzhou')

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      { label: '杭州', value: 'hangzhou', children: [{ label: '西湖', value: 'xihu' }] },
      { label: '宁波', value: 'ningbo', children: [{ label: '海曙', value: 'haishu' }] }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [{ label: '南京', value: 'nanjing', children: [{ label: '玄武', value: 'xuanwu' }] }]
  }
]
</script>

<template>
  <BiliSpace direction="vertical" size="md" style="width: 360px">
    <BiliCascader v-model="value" :options="options" change-on-select clearable />
    <span class="hint">
      每一级都可选中；点击父级后仍会展开下一列，当前值：{{ value }}
    </span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
