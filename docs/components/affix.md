---
title: Affix 固钉
---

# Affix 固钉

将元素固定在视口顶部或底部，离开阈值后回到正常文档流，并在固定的同时保持在目标容器范围内。

<script setup>
import DemoBasic from '../examples/affix/basic.vue'
import basicCode from '../examples/affix/basic.vue?raw'
import DemoBottom from '../examples/affix/bottom.vue'
import bottomCode from '../examples/affix/bottom.vue?raw'
</script>

## 基础用法

`offset` 是固定时距离视口边缘的间距。滚动页面，元素到达阈值后会固定，并通过占位保持原有布局高度。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 底部固钉

`position="bottom"` 时元素在接近视口底部时吸附；传入 `target` 可限制元素不超出目标容器。

<DemoBlock :code="bottomCode">
  <DemoBottom />
</DemoBlock>

## API

### Props

| 属性       | 说明                   | 类型                    | 默认值  |
| ---------- | ---------------------- | ----------------------- | ------- |
| `offset`   | 固定时距视口边缘的距离 | `number`                | `0`     |
| `position` | 固定方向               | `'top' \| 'bottom'`     | `'top'` |
| `target`   | 边界容器元素或选择器   | `string \| HTMLElement` | —       |
| `z-index`  | 固定内容的层级         | `number`                | `100`   |

### Events

| 事件名   | 说明         | 回调参数           |
| -------- | ------------ | ------------------ |
| `change` | 固定状态变化 | `(fixed: boolean)` |

### Exposes

| 方法 / 属性 | 说明                 |
| ----------- | -------------------- |
| `update()`  | 手动重新计算固定状态 |
| `fixed`     | 当前是否固定         |

## 说明

- 固定时根节点保留同尺寸占位，避免页面布局跳动；宽度在固定瞬间同步为内容宽度。
- 同时监听窗口滚动、目标容器滚动与 `ResizeObserver`，布局变化后会重新计算。
- 传入 `target` 后，内容会在目标容器上下边界内钳制，不会脱离容器。
