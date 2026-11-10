---
title: Skeleton 骨架屏
---

# Skeleton 骨架屏

在内容加载完成前展示占位结构，减少布局跳动与空白等待感。

<script setup>
import DemoBasic from '../examples/skeleton/basic.vue'
import basicCode from '../examples/skeleton/basic.vue?raw'
</script>

## 基础用法

`loading` 控制骨架屏与真实内容的切换；`avatar` 增加头像区，`animated` 开启扫光动画。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Skeleton Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `loading` | 是否显示骨架屏 | `boolean` | `true` |
| `rows` | 文本行数 | `number` | `3` |
| `avatar` | 是否显示头像区 | `boolean` | `false` |
| `animated` | 是否开启扫光 | `boolean` | `false` |
| `title` | 是否显示标题行 | `boolean` | `true` |

### SkeletonItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `variant` | 形状 | `'text' \| 'circle' \| 'image' \| 'rect' \| 'button'` | `'text'` |
| `width` | 宽度 | `string \| number` | — |
| `height` | 高度 | `string \| number` | — |
| `size` | 正方形尺寸（圆形/头像） | `string \| number` | — |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 加载完成后的真实内容 |
| `template` | 完全自定义的骨架结构 |

## 说明

- 默认文本行最后一行会自动缩短到 72%，读起来更像真实段落。
- 扫光动画作用在整棵骨架树上，多个 `SkeletonItem` 的节奏一致。
- 亮色用白色高光、暗色用低透明度高光，避免刺眼。
- 骨架元素对辅助技术隐藏（`aria-hidden`），容器带 `aria-busy`。
