---
title: Table 表格
---

# Table 表格

用于展示结构化数据，支持列配置、排序、斑马纹、边框、加载态与自定义单元格。

<script setup>
import DemoBasic from '../examples/table/basic.vue'
import basicCode from '../examples/table/basic.vue?raw'
import DemoAdvanced from '../examples/table/advanced.vue'
import advancedCode from '../examples/table/advanced.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 排序、加载与自定义单元格

点击可排序表头会在升序 → 降序 → 取消之间循环；`cell-<prop>` 插槽可自定义单元格内容。

<DemoBlock :code="advancedCode">
  <DemoAdvanced />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 表格数据 | `any[]` | `[]` |
| `columns` | 列配置 | `TableColumn[]` | `[]` |
| `border` | 是否显示边框 | `boolean` | `false` |
| `stripe` | 是否斑马纹 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `loading` | 是否加载中 | `boolean` | `false` |
| `empty-text` | 空数据文案 | `string` | `'暂无数据'` |
| `row-key` | 行唯一键，字段名或取值函数 | `string \| ((row) => string \| number)` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `sort-change` | 排序变化 | `({ prop, order })`，`order` 为 `'asc' \| 'desc' \| null` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `cell-<prop>` | 自定义某一列单元格，作用域参数 `{ row, column, value, index }` |
| `header-<prop>` | 自定义某一列表头，作用域参数 `{ column }` |
| `empty` | 空状态内容 |

### TableColumn

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `prop` | 取值字段，支持 `a.b` 路径 | `string` |
| `label` | 表头文本 | `string` |
| `width` | 列宽 | `string \| number` |
| `minWidth` | 最小列宽 | `string \| number` |
| `align` | 对齐方式 | `'left' \| 'center' \| 'right'` |
| `sortable` | 是否可排序 | `boolean` |
| `formatter` | 单元格格式化函数 | `(row, column, value, index) => string` |
| `slot` | 自定义插槽后缀，默认使用 `prop` | `string` |
| `className` | 单元格附加类名 | `string` |

## 说明

当前版本提供客户端排序与横向滚动，固定列、虚拟滚动与树形数据在后续版本规划中。
