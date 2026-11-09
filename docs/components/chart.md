---
title: Chart 图表
---

# Chart 图表

轻量 SVG 图表组件，**不引入第三方图表库**（维持仅 `@floating-ui/dom` 一个运行时依赖）。颜色取自设计令牌中的 `--bili-chart-color-*`，切换亮/暗主题时自动适配；宽度由 `ResizeObserver` 跟随容器变化。

<script setup>
import DemoLine from '../examples/chart/line.vue'
import lineCode from '../examples/chart/line.vue?raw'
import DemoBar from '../examples/chart/bar.vue'
import barCode from '../examples/chart/bar.vue?raw'
import DemoPie from '../examples/chart/pie.vue'
import pieCode from '../examples/chart/pie.vue?raw'
import DemoGauge from '../examples/chart/gauge.vue'
import gaugeCode from '../examples/chart/gauge.vue?raw'
</script>

## 折线图

支持多系列、平滑曲线与面积填充；`data` 中出现 `null` 会断开线段而不是连成直线。

<DemoBlock :code="lineCode">
  <DemoLine />
</DemoBlock>

## 柱状图

默认分组，`stacked` 后按 `stack` 名堆叠；`horizontal` 切换为横向条形图。

<DemoBlock :code="barCode">
  <DemoBar />
</DemoBlock>

## 饼图与环形图

`inner-radius` 为 0 时是饼图，大于 0 时是环形图（0.6 左右最好看）。占比 ≥4% 的扇区会显示百分比。

<DemoBlock :code="pieCode">
  <DemoPie />
</DemoBlock>

## 仪表盘

270° 弧形仪表盘，适合展示单一指标完成度。

<DemoBlock :code="gaugeCode">
  <DemoGauge />
</DemoBlock>

## LineChart API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `categories` | X 轴分类 | `Array<string \| number>` | `[]` |
| `series` | 数据系列 | `LineSeries[]` | `[]` |
| `height` | 图表高度 | `string \| number` | `280` |
| `smooth`（系列内） | 是否平滑曲线 | `boolean` | `false` |
| `area`（系列内） | 是否填充面积 | `boolean` | `false` |
| `showDots` | 是否显示悬浮点 | `boolean` | `true` |
| `showLegend` | 是否显示图例（多于 1 个系列时） | `boolean` | `true` |
| `showGrid` | 是否显示网格线 | `boolean` | `true` |
| `beginAtZero` | 值轴是否从 0 开始 | `boolean` | `false` |
| `min` / `max` | 手动指定值轴范围 | `number` | — |
| `valueFormatter` | 数值格式化函数 | `(value: number) => string` | 内置格式化 |
| `emptyText` | 空数据文案 | `string` | `'暂无数据'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `point-click` | 点击数据点 | `{ series, category, value, index }` |

## BarChart API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `categories` | 分类轴 | `Array<string \| number>` | `[]` |
| `series` | 数据系列，`stack` 相同的系列会堆叠 | `BarSeries[]` | `[]` |
| `height` | 图表高度 | `string \| number` | `280` |
| `stacked` | 是否堆叠 | `boolean` | `false` |
| `horizontal` | 是否横向条形 | `boolean` | `false` |
| `borderRadius` | 柱体圆角 | `number` | `4` |
| `showLegend` / `showGrid` | 图例 / 网格 | `boolean` | `true` |
| `min` / `max` | 值轴范围 | `number` | — |
| `valueFormatter` | 数值格式化 | `(value: number) => string` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `bar-click` | 点击柱体 | `{ series, category, value, index }` |

## PieChart API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 数据项 | `PieDatum[]` | `[]` |
| `height` | 高度 | `string \| number` | `280` |
| `innerRadius` | 内半径比例（0–0.95） | `number` | `0` |
| `showLegend` | 是否显示图例 | `boolean` | `true` |
| `showLabels` | 是否显示百分比 | `boolean` | `true` |
| `valueFormatter` | 数值格式化 | `(value: number) => string` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `slice-click` | 点击扇区 | `{ name, value, percent, index }` |

## GaugeChart API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 当前值 | `number` | `0` |
| `min` / `max` | 量程 | `number` | `0` / `100` |
| `height` | 高度 | `string \| number` | `220` |
| `label` | 数值下方的说明文字 | `string` | `''` |
| `unit` | 单位 | `string` | `'%'` |
| `color` | 进度弧颜色 | `string` | 主色 |
| `thickness` | 弧线粗细（px） | `number` | `14` |

## 类型

```ts
interface LineSeries {
  name: string
  data: Array<number | null>
  color?: string
  smooth?: boolean
  area?: boolean
}

interface BarSeries {
  name: string
  data: number[]
  color?: string
  stack?: string
}

interface PieDatum {
  name: string
  value: number
  color?: string
}
```

## 样式变量

| 变量 | 说明 |
| --- | --- |
| `--bili-chart-color-1` … `--bili-chart-color-8` | 系列调色板 |
| `--bili-chart-grid-color` | 网格线颜色 |
| `--bili-chart-axis-color` | 轴线颜色 |
| `--bili-chart-label-color` | 轴标签颜色 |

## 说明

- 所有图表使用内联 SVG 绘制，**没有 canvas 或第三方渲染器**，天然支持 SSR 输出与 CSS 变量换肤。
- 宽度通过 `ResizeObserver` 跟随容器，高度由 `height` 指定，因此图内文字和线宽始终是像素精确的，不会被拉伸变形。
- 数值轴刻度采用 1/2/5 × 10ⁿ 的「漂亮刻度」算法；`niceDomain`、`buildTicks` 等工具同时对外导出，便于自行绘制。
- 悬浮提示、图例、空状态均为内置能力，无需额外组合。
- 大数据量（上万点）建议先做降采样；当前实现面向常规仪表盘与报表场景。
