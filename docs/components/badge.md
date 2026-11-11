---
title: Badge 徽标
---

# Badge 徽标

用于展示消息数量、状态点或简短标记，支持包裹在头像、图标等元素右上角。

<script setup>
import DemoBasic from '../examples/badge/basic.vue'
import basicCode from '../examples/badge/basic.vue?raw'
import DemoRibbon from '../examples/badge/ribbon.vue'
import ribbonCode from '../examples/badge/ribbon.vue?raw'
</script>

## 基础用法

`value` 展示数字或文字，超过 `max` 自动显示 `99+`；`dot` 渲染为小圆点；`status` 渲染带文字的状态点。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 缎带角标

`BiliBadgeRibbon` 在内容右上角（或左上角）叠加一条带折角的缎带，适合 VIP、NEW、限时等标记。

<DemoBlock :code="ribbonCode">
  <DemoRibbon />
</DemoBlock>

### BadgeRibbon Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `text` | 缎带文字 | `string` | `''` |
| `color` | 自定义背景色 | `string` | 主题主色 |
| `placement` | 位置 | `'start' \| 'end'` | `'end'` |

| 插槽名 | 说明 |
| --- | --- |
| `default` | 被标记的内容 |
| `text` | 自定义缎带内容 |

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 徽标内容，数字或文字 | `string \| number` | — |
| `max` | 数字上限，超出显示 `${max}+` | `number` | `99` |
| `dot` | 是否只显示圆点 | `boolean` | `false` |
| `hidden` | 是否隐藏徽标（保留布局） | `boolean` | `false` |
| `showZero` | 值为 0 时是否显示 | `boolean` | `false` |
| `type` | 颜色类型 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'danger'` |
| `status` | 状态点类型 | `'success' \| 'processing' \| 'default' \| 'error' \| 'warning'` | — |
| `color` | 自定义徽标颜色 | `string` | `''` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 被包裹的内容；`status` 模式下作为状态文字 |
| `content` | 自定义徽标内容 |

## 说明

- 有默认插槽时徽标绝对定位在右上角，无插槽时作为独立徽标内联展示。
- 数字使用 `tabular-nums`，数值变化时不会引起宽度跳动。
- `processing` 状态点带一层脉冲扩散动画，用于表示进行中。
- 徽标带 1.5px 背景色描边，叠在头像上时边界更清晰。
