---
title: Tooltip 文字提示
---

# Tooltip 文字提示

用于展示简短的说明信息，支持 12 个方向、多种触发方式与亮/暗两种风格。

<script setup>
import DemoBasic from '../examples/tooltip/basic.vue'
import basicCode from '../examples/tooltip/basic.vue?raw'
import DemoTrigger from '../examples/tooltip/trigger.vue'
import triggerCode from '../examples/tooltip/trigger.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 触发方式

支持 `hover`、`focus`、`click` 与 `manual` 四种触发方式；手动模式下通过组件实例的 `show()` / `hide()` 控制。

<DemoBlock :code="triggerCode">
  <DemoTrigger />
</DemoBlock>

## API

### Props

| 属性           | 说明                             | 类型                                        | 默认值    |
| -------------- | -------------------------------- | ------------------------------------------- | --------- |
| `content`      | 提示文本                         | `string`                                    | `''`      |
| `placement`    | 出现位置                         | `Placement`（12 个方向）                    | `'top'`   |
| `trigger`      | 触发方式                         | `'hover' \| 'focus' \| 'click' \| 'manual'` | `'hover'` |
| `effect`       | 风格                             | `'dark' \| 'light'`                         | `'dark'`  |
| `disabled`     | 是否禁用                         | `boolean`                                   | `false`   |
| `delay`        | 显示/隐藏延迟（毫秒）            | `number`                                    | `100`     |
| `offset`       | 与触发元素的间距                 | `number`                                    | `8`       |
| `show-arrow`   | 是否显示箭头                     | `boolean`                                   | `true`    |
| `max-width`    | 最大宽度                         | `string \| number`                          | `320px`   |
| `popper-class` | 浮层额外类名，用于多实例主题隔离 | `string`                                    | `''`      |

### Events

| 事件名           | 说明         | 回调参数             |
| ---------------- | ------------ | -------------------- |
| `visible-change` | 显示状态变化 | `(visible: boolean)` |

### Slots

| 插槽名    | 说明                                      |
| --------- | ----------------------------------------- |
| `default` | 触发元素                                  |
| `content` | 自定义提示内容，优先级高于 `content` 属性 |

### Exposes

| 方法 / 属性         | 说明                 |
| ------------------- | -------------------- |
| `show()` / `hide()` | 显示 / 隐藏提示      |
| `visible`           | 当前显示状态（只读） |

## 无障碍

触发元素会获得 `aria-describedby` 指向提示内容；`hover` 模式下同时监听 `focusin`，键盘用户也能看到提示。
