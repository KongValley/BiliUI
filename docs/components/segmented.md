---
title: Segmented 分段控制器
---

# Segmented 分段控制器

在多个互斥选项之间切换，常用于视图切换、筛选维度或密度选择。

<script setup>
import DemoBasic from '../examples/segmented/basic.vue'
import basicCode from '../examples/segmented/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

`v-model` 绑定当前值，`options` 提供选项；支持图标、尺寸、撑满与整体禁用。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

<ApiReference name="BiliSegmented" />

## 说明

- 受控组件，值变化通过 `update:modelValue` / `change` 回传。
- 支持 `←` / `→` 或 `↑` / `↓` 切换，`Home` / `End` 跳到首尾。
- 滑块位置通过测量选项宽度计算，窗口尺寸变化时自动重算。
