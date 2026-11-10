---
title: Timeline 时间线
---

# Timeline 时间线

按时间顺序展示事件流，支持语义色、自定义颜色、图标与自定义节点。

<script setup>
import DemoBasic from '../examples/timeline/basic.vue'
import basicCode from '../examples/timeline/basic.vue?raw'
import DemoCustom from '../examples/timeline/custom.vue'
import customCode from '../examples/timeline/custom.vue?raw'
</script>

## 基础用法

`BiliTimeline` 包裹若干 `BiliTimelineItem`，通过 `timestamp` 展示时间，默认插槽渲染内容；`type` 控制节点颜色。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 自定义节点

`color` 覆盖语义色，`icon` 在节点内渲染内置图标，`hollow` 使用空心节点；`dot` 插槽可以完全自定义节点内容。

<DemoBlock :code="customCode">
  <DemoCustom />
</DemoBlock>

## Timeline API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `reverse` | 按相反顺序展示 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 时间线节点，通常放置 `BiliTimelineItem` |

## TimelineItem API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `timestamp` | 时间文本 | `string` | `''` |
| `type` | 语义色 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` |
| `color` | 自定义节点颜色，优先级高于 `type` | `string` | — |
| `icon` | 节点内图标名称 | `string` | — |
| `hollow` | 是否空心节点 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 事件内容 |
| `timestamp` | 自定义时间区域 |
| `dot` | 自定义节点内容 |

## 说明

- 最后一项的连接线会自动隐藏；`reverse` 模式下由第一项隐藏。
- `icon` 与 `hollow` 可组合使用，图标颜色跟随节点颜色。
- 连接线使用 2px 竖线，节点与内容间距可通过组件样式变量覆盖。
