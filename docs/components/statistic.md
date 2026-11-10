---
title: Statistic 数值统计
---

# Statistic 数值统计

展示关键指标，内置千分位分组、精度控制、前后缀与自定义格式化。

<script setup>
import DemoBasic from '../examples/statistic/basic.vue'
import basicCode from '../examples/statistic/basic.vue?raw'
import DemoPrecision from '../examples/statistic/precision.vue'
import precisionCode from '../examples/statistic/precision.vue?raw'
</script>

## 基础用法

`title` 展示指标名称，`value` 支持数字或数字字符串；默认按三位分组。`prefix` / `suffix` 适合货币、百分比、单位等场景。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 精度与格式化

`precision` 固定小数位，`group-separator` / `decimal-separator` 可切换为欧洲习惯格式，`formatter` 完全接管展示逻辑。`title` / `prefix` / `suffix` 插槽可放富内容。

<DemoBlock :code="precisionCode">
  <DemoPrecision />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 指标名称 | `string` | `''` |
| `value` | 指标值 | `number \| string` | `0` |
| `precision` | 保留小数位 | `number` | — |
| `prefix` | 前缀文本 | `string` | `''` |
| `suffix` | 后缀文本 | `string` | `''` |
| `group-separator` | 千分位分隔符 | `string` | `','` |
| `decimal-separator` | 小数点符号 | `string` | `'.'` |
| `formatter` | 自定义格式化函数 | `(value: number \| string) => string` | — |
| `color` | 数值颜色 | `string` | 文本主色 |
| `value-style` | 数值额外样式 | `CSSProperties` | — |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `title` | 自定义指标名称 |
| `prefix` | 自定义前缀 |
| `suffix` | 自定义后缀 |

## 说明

- 传入 `formatter` 时不再做分组与精度处理，由函数返回最终文本。
- 非数字字符串（如 `N/A`）原样展示，不会被替换为 `NaN`。
- `precision` 使用 `toFixed` 语义，会对数值进行四舍五入。
- 数字使用等宽数字（`tabular-nums`），多指标并排时纵向对齐。
