---
title: Tag 标签
---

# Tag 标签

标签用于标记分类、状态或属性，支持语义色、三种视觉效果与可关闭能力。

<script setup>
import DemoBasic from '../examples/tag/basic.vue'
import basicCode from '../examples/tag/basic.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 标签类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `effect` | 视觉效果 | `'light' \| 'dark' \| 'plain'` | `'light'` |
| `closable` | 是否可关闭 | `boolean` | `false` |
| `round` | 是否圆角 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `close` | 点击关闭按钮时触发 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容 |

## 说明

`close` 事件不会自动移除标签，需要在业务侧自行维护数据源。示例中通过 `tags` 数组过滤实现了真实关闭效果。
