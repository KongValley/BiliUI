---
title: Pagination 分页
---

# Pagination 分页

用于较长的数据列表分页，支持页码折叠、每页条数、总数与跳页。

<script setup>
import DemoBasic from '../examples/pagination/basic.vue'
import basicCode from '../examples/pagination/basic.vue?raw'
import DemoFull from '../examples/pagination/full.vue'
import fullCode from '../examples/pagination/full.vue?raw'
</script>

## 基础用法

通过 `v-model:current-page` 与 `v-model:page-size` 双向绑定分页状态。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 完整布局

`layout` 支持 `total` / `sizes` / `prev` / `pager` / `next` / `jumper` 的组合，可用逗号分隔字符串或数组传入。

<DemoBlock :code="fullCode">
  <DemoFull />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `total` | 数据总数 | `number` | `0` |
| `current-page` | 当前页 | `number` | `1` |
| `page-size` | 每页条数 | `number` | `10` |
| `page-sizes` | 每页条数可选项 | `number[]` | `[10, 20, 50, 100]` |
| `layout` | 布局组合 | `string \| string[]` | `'prev, pager, next'` |
| `pager-count` | 页码按钮数量（最小 5，自动取奇数） | `number` | `7` |
| `background` | 是否为页码按钮添加背景 | `boolean` | `false` |
| `small` | 是否紧凑模式 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `hide-on-single-page` | 只有一页时隐藏 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:current-page` | 当前页变化 | `(page: number)` |
| `update:page-size` | 每页条数变化 | `(size: number)` |
| `current-change` | 当前页变化 | `(page: number)` |
| `size-change` | 每页条数变化 | `(size: number)` |
| `change` | 分页变化 | `(page: number, size: number)` |

## 说明

- 每页条数变化时会重置到第 1 页。
- 页码折叠规则与主流组件库一致，靠近首尾时自动收缩中间页码。
- 换页按钮使用原生 `button` 并带 `aria-label`，跳页输入支持回车。
