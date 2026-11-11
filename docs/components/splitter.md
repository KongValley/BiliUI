---
title: Splitter 面板分割
---

# Splitter 面板分割

把容器拆成可拖拽调整比例的两个面板，支持水平 / 垂直方向与键盘操作。

<script setup>
import DemoBasic from '../examples/splitter/basic.vue'
import basicCode from '../examples/splitter/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

`v-model` 绑定起始面板的百分比；拖动分隔条调整比例，双击恢复 50%。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

<ApiReference name="BiliSplitter" />

## 说明

- 方向由 `direction` 控制，支持 `horizontal` / `vertical`。
- 拖拽时限制在 `min`–`max` 之间，键盘方向键按 `step` 调整。
- 分隔条带 `separator` 语义与 `aria-valuenow`，支持 `Home` / `End`。
- 面板内容超出时在各自区域内滚动。
