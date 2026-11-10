---
title: Progress 进度条
---

# Progress 进度条

展示操作进度，支持线形、环形、仪表盘三种形态，以及状态色、区间进度和条纹动画。

<script setup>
import DemoBasic from '../examples/progress/basic.vue'
import basicCode from '../examples/progress/basic.vue?raw'
</script>

## 基础用法

`percentage` 为 0–100 的完成度，达到 100 时自动切换为成功色。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `percentage` | 完成百分比，超出范围会被收敛到 0–100 | `number` | `0` |
| `type` | 展示形态 | `'line' \| 'circle' \| 'dashboard'` | `'line'` |
| `status` | 状态色 | `'normal' \| 'success' \| 'warning' \| 'error'` | `'normal'` |
| `stroke-width` | 线宽／环宽 | `number` | 线形 8、环形 6 |
| `show-text` | 是否显示百分比文字 | `boolean` | `true` |
| `format` | 自定义文字 | `(percentage: number) => string` | — |
| `color` | 自定义颜色，覆盖状态色 | `string` | `''` |
| `success-percentage` | 第二段进度（如已完成中的合格部分） | `number` | `0` |
| `striped` | 是否显示条纹 | `boolean` | `false` |
| `striped-animated` | 条纹是否滚动 | `boolean` | `false` |
| `size` | 环形／仪表盘直径（px） | `number` | `120` |
| `round` | 端点是否圆角 | `boolean` | `true` |

## 说明

- 线形进度通过宽度过渡动画推进；环形通过 `stroke-dasharray` 推进，两者都使用设计令牌中的缓动曲线。
- `dashboard` 为 270° 弧，缺口朝下；`circle` 为完整圆环。
- `success-percentage` 只会在第一段进度范围内绘制，用于「总进度中的成功部分」这类场景。
- 环形通过内联 SVG 绘制，无 canvas 依赖；`color` 会生成同色渐变。
