---
title: Button 按钮
---

# Button 按钮

按钮用于触发一个即时操作，提供多种语义类型、尺寸与状态。

<script setup>
import DemoBasic from '../examples/button/basic.vue'
import basicCode from '../examples/button/basic.vue?raw'
import DemoStates from '../examples/button/states.vue'
import statesCode from '../examples/button/states.vue?raw'
</script>

## 基础用法

通过 `type` 切换语义类型，默认类型适合次要操作。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 状态与尺寸

`plain` 提供浅色底，`round` / `circle` 控制外观，`loading` 会阻止重复点击，`block` 用于撑满容器。

<DemoBlock :code="statesCode">
  <DemoStates />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `plain` | 是否为朴素按钮 | `boolean` | `false` |
| `round` | 是否为圆角按钮 | `boolean` | `false` |
| `circle` | 是否为圆形按钮 | `boolean` | `false` |
| `loading` | 是否处于加载状态 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `block` | 是否撑满父容器 | `boolean` | `false` |
| `icon` | 图标名称，见 Icon 组件 | `string` | `''` |
| `native-type` | 原生 button 的 type | `'button' \| 'submit' \| 'reset'` | `'button'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `click` | 点击按钮且未被禁用时触发 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮文本 |
| `icon` | 自定义图标内容，优先级高于 `icon` 属性 |

### 样式变量

| 变量 | 说明 |
| --- | --- |
| `--bili-button-height` | 按钮高度 |
| `--bili-button-padding` | 水平内边距 |
| `--bili-button-radius` | 圆角 |
| `--bili-button-bg` | 背景色 |
| `--bili-button-color` | 文字颜色 |
| `--bili-button-border` | 边框颜色 |
