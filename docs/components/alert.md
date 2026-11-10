---
title: Alert 警告提示
---

# Alert 警告提示

页面内常驻的提示条，用于说明状态、风险或操作结果。与 `Message` 的区别是：Alert 属于内容流，不会被自动关闭。

<script setup>
import DemoBasic from '../examples/alert/basic.vue'
import basicCode from '../examples/alert/basic.vue?raw'
</script>

## 基础用法

`type` 决定语义色，`closable` 允许用户关闭，`bordered` 增加描边，`show-icon` 显示状态图标。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 语义类型 | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `title` | 标题 | `string` | `''` |
| `description` | 描述文字 | `string` | `''` |
| `bordered` | 是否显示描边 | `boolean` | `false` |
| `show-icon` | 是否显示图标 | `boolean` | `false` |
| `closable` | 是否可关闭 | `boolean` | `false` |
| `visible` | 受控显隐，配合 `v-model:visible` | `boolean` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:visible` | 显隐变化 | `(value: boolean)` |
| `close` | 点击关闭 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 描述内容，优先于 `description` |
| `title` | 自定义标题 |
| `action` | 右侧操作区 |

## 说明

- 不传 `visible` 时组件自己管理显隐；传入后为受控模式，必须监听 `update:visible` 才能关闭。
- 关闭带淡出与上移的离场动画，`prefers-reduced-motion` 下自动跳过。
- 图标与文字颜色按类型取语义色，亮/暗主题各自映射。
