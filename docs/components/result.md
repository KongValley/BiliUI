---
title: Result 结果页
---

# Result 结果页

用于反馈一系列操作任务的处理结果，如成功、失败或错误页。

<script setup>
import DemoBasic from '../examples/result/basic.vue'
import basicCode from '../examples/result/basic.vue?raw'
</script>

## 基础用法

`status` 决定图标与配色，`title` / `sub-title` 描述结果，默认插槽放操作按钮。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `status` | 结果状态 | `'success' \| 'warning' \| 'info' \| 'error' \| '403' \| '404' \| '500'` | `'info'` |
| `title` | 标题 | `string` | `''` |
| `subTitle` | 副标题 | `string` | `''` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `icon` | 自定义图标 |
| `title` | 自定义标题 |
| `subTitle` | 自定义副标题 |
| `default` | 底部操作区 |

## 说明

- `403 / 404 / 500` 渲染为大号状态码，其余状态使用内联 SVG 图标。
- 图标带弹性缩放入场动画，遵循 `prefers-reduced-motion`。
- 语义色映射：success → 成功色、warning → 警告色、error/500 → 危险色。
