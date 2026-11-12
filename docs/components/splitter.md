---
title: Splitter 面板分割
---

# Splitter 面板分割

把容器拆成可拖拽调整比例的面板，支持两栏与多栏布局、水平 / 垂直方向与键盘操作。

<script setup>
import DemoBasic from '../examples/splitter/basic.vue'
import basicCode from '../examples/splitter/basic.vue?raw'
import DemoPanels from '../examples/splitter/panels.vue'
import panelsCode from '../examples/splitter/panels.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

`v-model` 绑定起始面板的百分比；拖动分隔条调整比例，双击恢复 50%。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 多面板

把 `BiliSplitterPanel` 放进默认插槽即可渲染任意数量的面板，`v-model:sizes` 以百分比数组双向绑定。`collapsible` 的面板可以双击相邻分隔条折叠 / 展开。

<DemoBlock :code="panelsCode">
  <DemoPanels />
</DemoBlock>

### SplitterPanel Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `size` | 初始尺寸，数字按百分比处理，也支持 `%` / `px` 字符串 | `number \| string` | 等分 |
| `min` | 最小尺寸 | `number \| string` | `0` |
| `max` | 最大尺寸 | `number \| string` | `100` |
| `collapsible` | 是否允许通过双击分隔条折叠 | `boolean` | `false` |
| `resizable` | 是否允许拖拽调整 | `boolean` | `true` |

### 多面板事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:sizes` | 面板尺寸变化 | `(sizes: number[])` |
| `resize` | 拖拽或键盘调整时持续触发 | `(sizes: number[])` |
| `resize-start` | 开始拖拽 | — |
| `resize-end` | 结束拖拽 | — |
| `collapse` | 面板折叠状态变化 | `(index: number, collapsed: boolean)` |

## API

<ApiReference name="BiliSplitter" />

## 说明

- 两栏模式使用 `v-model` + `start` / `end` 插槽，行为与旧版本一致；默认插槽出现时自动切换到多面板模式。
- 多面板模式下面板尺寸统一按百分比归一化，`px` 尺寸会在容器可测量后换算。
- 拖拽时限制在 `min`–`max` 之间，键盘方向键按 `step` 调整；多面板模式下每个分隔条独立响应。
- 分隔条带 `separator` 语义与 `aria-valuenow`，支持 `Home` / `End`；可折叠面板额外支持 `Enter` / 空格。
- 面板内容超出时在各自区域内滚动。
