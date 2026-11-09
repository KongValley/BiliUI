---
title: Space 间距
---

# Space 间距

Space 用于为子元素提供统一的间距，支持水平/垂直、换行与对齐控制。

<script setup>
import DemoBasic from '../examples/space/basic.vue'
import basicCode from '../examples/space/basic.vue?raw'
</script>

## 基础用法

`size` 支持 `sm` / `md` / `lg` 预设，也支持数字（px）；`wrap` 在空间不足时自动换行。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `direction` | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `size` | 间距 | `'sm' \| 'md' \| 'lg' \| number \| string` | `'md'` |
| `align` | 交叉轴对齐方式 | `'start' \| 'center' \| 'end' \| 'baseline'` | 水平时 `center` |
| `wrap` | 是否自动换行 | `boolean` | `false` |
| `fill` | 是否撑满父容器 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 需要排列的内容 |

## 说明

- 垂直排列时 `align` 默认拉伸（`stretch`），可通过显式传值改变。
- 间距通过 CSS `gap` 实现，不会为子元素包裹额外容器。
