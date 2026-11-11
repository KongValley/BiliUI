---
title: VirtualList 虚拟列表
---

# VirtualList 虚拟列表

只渲染可视区域内的节点，用固定行高支撑上万条数据的高性能滚动。

<script setup>
import DemoBasic from '../examples/virtual-list/basic.vue'
import basicCode from '../examples/virtual-list/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

设置 `height`、`itemHeight`，即可按需渲染；通过插槽控制每一行的内容。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

<ApiReference name="BiliVirtualList" />

## 说明

- 行高固定，`data` 变化时会自动重新计算可视窗口。
- `buffer` 控制视口外额外渲染的行数，默认 4 行。
- 通过 ref 调用 `scrollToIndex(index)` 或 `scrollTo(top)` 定位。
- 行内容超出宽度时自动省略，适合日志、消息流、长列表。
