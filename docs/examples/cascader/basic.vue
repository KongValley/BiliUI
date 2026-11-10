<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | number | null>('xihu')

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖', value: 'xihu' },
          { label: '上城', value: 'shangcheng' },
          { label: '滨江', value: 'binjiang' }
        ]
      },
      {
        label: '宁波',
        value: 'ningbo',
        children: [
          { label: '海曙', value: 'haishu' },
          { label: '鄞州', value: 'yinzhou' }
        ]
      }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [
          { label: '玄武', value: 'xuanwu' },
          { label: '鼓楼', value: 'gulou' }
        ]
      }
    ]
  }
]
</script>

<template>
  <BiliSpace direction="vertical" size="md" style="width: 360px">
    <BiliCascader
      v-model="value"
      :options="options"
      clearable
      placeholder="请选择所在地区"
    />
    <span class="hint">当前值：{{ value ?? '空' }}</span>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-text-secondary);
}
</style>
