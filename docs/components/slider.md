---
title: Slider 滑块
---

# Slider 滑块

通过拖动在区间内选择数值，支持单值与区间、刻度、纵向布局。

<script setup>
import DemoBasic from '../examples/slider/basic.vue'
import basicCode from '../examples/slider/basic.vue?raw'
</script>

## 基础用法

`modelValue` 传数字为单值，传 `[start, end]` 为区间；`InputNumber` 用于精确输入。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Slider Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前值或区间 | `number \| [number, number]` | `0` |
| `min` | 最小值 | `number` | `0` |
| `max` | 最大值 | `number` | `100` |
| `step` | 步长 | `number` | `1` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `showTooltip` | 是否显示数值提示 | `boolean` | `true` |
| `formatTooltip` | 自定义提示文案 | `(value: number) => string` | — |
| `marks` | 刻度标记 | `boolean \| Record<string, string>` | `false` |
| `vertical` | 是否纵向 | `boolean` | `false` |

### InputNumber Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前值 | `number` | — |
| `min` / `max` | 取值范围 | `number` | `-Infinity` / `Infinity` |
| `step` | 步长 | `number` | `1` |
| `precision` | 保留小数位 | `number` | 由 `step` 推导 |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `controls` | 是否显示步进按钮 | `boolean` | `true` |
| `formatter` / `parser` | 显示与解析格式化 | `function` | — |
| `align` | 文本对齐 | `'left' \| 'center' \| 'right'` | `'left'` |

### Events

Slider：`update:modelValue`、`change`
InputNumber：`update:modelValue`、`change`、`focus`、`blur`

## 说明

- 滑块使用 Pointer Events，支持鼠标、触摸与触控笔；点击轨道会直接跳转。
- 区间模式下两个手柄不会交叉，拖过对方时自动归一化顺序。
- 滑块获得焦点后可用方向键按 `step` 调整。
- InputNumber 在聚焦时保留原始输入，失焦后才做范围约束与精度处理。
