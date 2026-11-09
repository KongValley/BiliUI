---
title: Divider 分割线
---

# Divider 分割线

用于分隔内容区块，支持水平/垂直、虚线以及文案位置。

<script setup>
import DemoBasic from '../examples/divider/basic.vue'
import basicCode from '../examples/divider/basic.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `direction` | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `content-position` | 文案位置（仅水平方向） | `'left' \| 'center' \| 'right'` | `'center'` |
| `dashed` | 是否虚线 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 分割线中的文案；垂直分割线不渲染文案 |

## 说明

- 垂直分割线高度为 `1em`，适合放在行内文本之间。
- 带文案的水平分割线使用 Flex 布局，文案两侧自动伸缩。
