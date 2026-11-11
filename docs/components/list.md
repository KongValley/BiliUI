---
title: List 列表
---

# List 列表

以纵向列表展示一组数据，支持头部、底部、分隔线、悬停反馈、加载与空状态。

<script setup>
import DemoBasic from '../examples/list/basic.vue'
import basicCode from '../examples/list/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

通过 `data` 传入数据，默认插槽接收 `{ item, index }`；不传插槽时直接渲染数据项。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

<ApiReference name="BiliList" />

## 说明

- `rowKey` 支持字段名或 `(item, index) => key`。
- `split` 控制项目之间的分隔线，`hoverable` 开启悬停背景。
- 空数据自动展示 `Empty`，`loading` 时显示遮罩并隐藏空状态。
