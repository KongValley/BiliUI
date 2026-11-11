---
title: Scrollbar 滚动条
---

# Scrollbar 滚动条

自定义滚动条，替代浏览器原生滚动条；支持纵向 / 横向、固定高度、悬浮显示与拖拽滚动。

<script setup>
import DemoBasic from '../examples/scrollbar/basic.vue'
import basicCode from '../examples/scrollbar/basic.vue?raw'
</script>

## 基础用法

用 `height` 固定可视高度，内容超出后出现自定义滚动条。默认只在悬停时显示，`always` 可以常驻显示。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 说明

- 拖拽滑块、点击轨道和滚轮滚动都会同步内容区位置。
- `max-height` 适合内容高度不固定、但最高不能超过某个值的场景。
- `native` 切换回浏览器原生滚动条，适合需要保留系统行为的场景。
- 组件通过 `ResizeObserver` 监听内容与容器尺寸，图片或字体加载完成后会自动重新计算滑块。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `height` | 可视区域高度 | `string \| number` | — |
| `maxHeight` | 最大高度 | `string \| number` | — |
| `native` | 使用原生滚动条 | `boolean` | `false` |
| `always` | 始终显示自定义滚动条 | `boolean` | `false` |
| `minSize` | 滑块最小长度（px） | `number` | `24` |
| `wrapClass` | 滚动容器的额外类名 | `string` | `''` |
| `viewClass` | 内容区的额外类名 | `string` | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `scroll` | 内容区滚动 | `{ scrollTop: number; scrollLeft: number }` |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `wrapRef` / `viewRef` | 滚动容器与内容区元素 | `HTMLElement \| null` |
| `update` | 手动重新计算滑块尺寸 | `() => void` |
| `setScrollTop` | 设置纵向滚动位置 | `(top: number) => void` |
