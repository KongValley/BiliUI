---
title: Layout 布局
---

# Layout 布局

页面级布局容器，由 `BiliLayout`、`BiliLayoutHeader`、`BiliLayoutAside`、`BiliLayoutContent`、`BiliLayoutFooter` 五个组件组合而成，适合中后台的固定头部 + 侧边栏结构。

<script setup>
import DemoAdmin from '../examples/layout/admin.vue'
import adminCode from '../examples/layout/admin.vue?raw'
import DemoBasic from '../examples/layout/basic.vue'
import basicCode from '../examples/layout/basic.vue?raw'
</script>

## 中后台布局

头部固定、侧边栏可折叠、内容区自适应剩余空间：

<DemoBlock :code="adminCode">
  <DemoAdmin />
</DemoBlock>

## 三种常见结构

`direction="horizontal"` 决定子元素横向排列。侧边栏可放在左侧或右侧，也可以放在头部下方。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## Layout API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `direction` | 子元素排列方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| `full-height` | 是否占满视口高度（`min-height: 100vh`） | `boolean` | `false` |

## LayoutHeader API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `height` | 高度 | `string \| number` | `56` |
| `sticky` | 是否吸顶 | `boolean` | `false` |

## LayoutAside API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `width` | 展开宽度 | `string \| number` | `220` |
| `collapsed` | 是否收起 | `boolean` | `false` |
| `collapsed-width` | 收起后的宽度 | `string \| number` | `64` |
| `sticky` | 是否吸附在视口顶部，并可独立滚动 | `boolean` | `false` |

## LayoutContent API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `padding` | 内容内边距，传 `0` 表示贴边 | `string \| number` | `16` |

## LayoutFooter API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `height` | 高度，默认由内容撑开 | `string \| number` | — |

## Slots

五个组件都只提供一个默认插槽用于放置内容。

## 说明

- `BiliLayout` 使用 Flex 布局：`Header` / `Footer` 固定高度不参与压缩，`Content` 占据剩余空间并可独立滚动。
- 侧边栏挂载后会自动通知父布局，无需手动配置「有侧边栏」标记。
- 嵌套布局时，内层 `Layout` 会自动继承父级的剩余高度。
- 需要整页应用外壳时设置 `full-height`；嵌入文档或弹窗内示例时保持默认即可。
