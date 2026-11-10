---
title: Breadcrumb 面包屑
---

# Breadcrumb 面包屑

展示当前页面在层级结构中的位置，帮助用户快速返回上级。

<script setup>
import DemoBasic from '../examples/breadcrumb/basic.vue'
import basicCode from '../examples/breadcrumb/basic.vue?raw'
</script>

## 基础用法

最后一项自动渲染为当前页（不可点击），其余项通过 `href` 或 `to` 跳转。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Breadcrumb Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `separator` | 分隔符 | `string` | `'/'` |
| `maxItems` | 超过该数量时折叠中间项，`0` 表示不折叠 | `number` | `0` |

### BreadcrumbItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `href` | 链接地址 | `string` | `''` |
| `to` | 路由目标（配合 vue-router） | `string \| object` | — |
| `replace` | 是否替换历史记录 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 面包屑项内容 |
| `separator` | 单个项的自定义分隔符（在 `BreadcrumbItem` 上） |

## 说明

- 使用 `<nav>` + `<ol>` 语义结构，当前项带 `aria-current="page"`。
- 折叠时保留首尾项，中间项隐藏并在第一个被隐藏项前渲染「…」。
- 每项可单独覆盖分隔符，适合混合图标或特殊符号的场景。
- 无 `href` 且非最后一项时不可点击，避免误触。
