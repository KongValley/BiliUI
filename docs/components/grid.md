---
title: Grid 栅格
---

# Grid 栅格

24 栏栅格系统，用于页面与区块内的自适应布局。`BiliRow` 负责行与间距，`BiliCol` 负责列宽、偏移与响应式断点。

<script setup>
import DemoBasic from '../examples/grid/basic.vue'
import basicCode from '../examples/grid/basic.vue?raw'
import DemoGutter from '../examples/grid/gutter.vue'
import gutterCode from '../examples/grid/gutter.vue?raw'
import DemoResponsive from '../examples/grid/responsive.vue'
import responsiveCode from '../examples/grid/responsive.vue?raw'
</script>

## 基础用法

一行总宽为 24 栏，`:span` 指定该列占用的栏数，超出后会换行。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 间距与偏移

`gutter` 支持数字（仅水平）或 `[水平, 垂直]` 数组；`offset` 让列向右偏移指定栏数，`push` / `pull` 做相对位移。

<DemoBlock :code="gutterCode">
  <DemoGutter />
</DemoBlock>

## 响应式

五个断点对应不同屏幕宽度，可传数字或 `{ span, offset }` 对象。未命中断点时继承上一级设置。

| 断点 | 触发宽度 | 说明 |
| --- | --- | --- |
| `xs` | < 576px | 手机 |
| `sm` | ≥ 576px | 大屏手机 |
| `md` | ≥ 768px | 平板 |
| `lg` | ≥ 992px | 桌面 |
| `xl` | ≥ 1200px | 宽屏桌面 |

<DemoBlock :code="responsiveCode">
  <DemoResponsive />
</DemoBlock>

## Row API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `gutter` | 列间距，`[水平, 垂直]` 或单值 | `number \| [number, number]` | `0` |
| `justify` | 主轴对齐 | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` |
| `align` | 交叉轴对齐 | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` |
| `wrap` | 是否允许换行 | `boolean` | `true` |

## Col API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `span` | 占用栏数（1–24） | `number` | `24` |
| `offset` | 向右偏移栏数 | `number` | `0` |
| `push` | 向右位移栏数 | `number` | `0` |
| `pull` | 向左位移栏数 | `number` | `0` |
| `xs` / `sm` / `md` / `lg` / `xl` | 响应式栏数与偏移 | `number \| { span?, offset? }` | — |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 列内容 |

## 说明

- 表格式布局（固定表头、等高卡片）请优先使用 `display: grid`；栅格更适合按比例分配的自适应场景。
- `gutter` 通过「行负边距 + 列内边距」实现，因此列内容不要额外依赖自身 `padding`。
- 响应式类名为 `bili-col--<断点>-<栏数>` 与 `bili-col--<断点>-offset-<栏数>`，可直接在业务样式中覆盖。
- `span` 为 0 时该列不显示，可用于条件隐藏。
