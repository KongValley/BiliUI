---
title: Flex 弹性布局
---

# Flex 弹性布局

用语义化的属性完成弹性布局，避免在业务里重复编写 `display: flex` 与对齐样式。

<script setup>
import DemoBasic from '../examples/flex/basic.vue'
import basicCode from '../examples/flex/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

`justify` 控制主轴对齐，`align` 控制交叉轴对齐，`gap` 接受 `small` / `middle` / `large` 预设或任意 CSS 长度。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

<ApiReference name="BiliFlex" />

## 说明

- `vertical` 等价于 `flex-direction: column`；`wrap` 支持布尔值或 `nowrap` / `wrap` / `wrap-reverse`。
- `gap` 的数字按 px 处理，`small` / `middle` / `large` 分别对应 `8px` / `16px` / `24px`。
- `justify` / `align` 的 `start`、`end` 会自动转换为 `flex-start`、`flex-end`。
- `component` 可以换成 `section`、`nav` 等语义标签；`flex` 用于设置容器自身的 `flex` 简写。
