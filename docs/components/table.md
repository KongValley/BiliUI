---
title: Table 表格
---

# Table 表格

用于展示结构化数据，支持列配置、排序、斑马纹、边框、加载态与自定义单元格，并支持**表头拖拽换列**、**拖拽调整列宽**与**多列排序**。

<script setup>
import DemoBasic from '../examples/table/basic.vue'
import basicCode from '../examples/table/basic.vue?raw'
import DemoAdvanced from '../examples/table/advanced.vue'
import advancedCode from '../examples/table/advanced.vue?raw'
import DemoDrag from '../examples/table/drag.vue'
import dragCode from '../examples/table/drag.vue?raw'
import DemoSorting from '../examples/table/sorting.vue'
import sortingCode from '../examples/table/sorting.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 表头拖拽

开启 `draggable-columns` 后，按住表头左右拖动即可调整列顺序；`resizable-columns`（默认开启）允许拖动表头右边界调整列宽。两个事件都会带回最新状态，便于持久化到服务端或用户偏好。

拖动过程中不会误触发排序，释放后列顺序立即生效。

<DemoBlock :code="dragCode">
  <DemoDrag />
</DemoBlock>

## 排序、加载与自定义单元格

点击可排序表头会在升序 → 降序 → 取消之间循环；`cell-<prop>` 插槽可自定义单元格内容。

<DemoBlock :code="advancedCode">
  <DemoAdvanced />
</DemoBlock>

## 多列排序

开启 `multi-sort` 后，按住 `Shift` 点击表头可叠加排序字段：先点的列优先级更高，表头右侧会显示优先级序号。普通点击仍会清空其他列，只保留当前列。

空值（`null` / `undefined` / 空字符串）无论升序降序都排在末尾。需要自定义比较逻辑时，给列配置 `sortMethod`。

<DemoBlock :code="sortingCode">
  <DemoSorting />
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
| `draggable-columns` | 是否允许拖动表头调整列顺序 | `boolean` | `false` |
| `resizable-columns` | 是否允许拖动表头边界调整列宽 | `boolean` | `true` |
| `resize-sensitivity` | 每拖动 1px 对应的列宽变化 | `number` | `1` |
| `min-column-width` | 列宽下限（px） | `number` | `60` |
| `multi-sort` | 是否允许 `Shift` 点击叠加多列排序 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `sort-change` | 排序变化 | `{ prop, order, sorts }`，`order` 为 `'asc' \| 'desc' \| null`，`sorts` 为按优先级排列的完整排序状态 |
| `column-order-change` | 拖动表头改变列顺序后触发 | `(order: string[])`，元素为各列的 key（`prop` 或 `slot`） |
| `column-resize` | 拖动边界调整列宽后触发 | `(key: string, width: number)` |

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
| `sortMethod` | 自定义比较函数，返回负数/0/正数 | `(a, b) => number` |
| `resizable` | 该列是否允许拖动调整宽度，默认跟随表格配置 | `boolean` |
| `formatter` | 单元格格式化函数 | `(row, column, value, index) => string` |
| `slot` | 自定义插槽后缀，默认使用 `prop` | `string` |
| `className` | 单元格附加类名 | `string` |

## 说明

- **列拖拽**与**列宽拖拽**互不干扰：拖动表头主体换顺序，拖动表头右边界改宽度；拖拽过程中点击不会触发排序。
- 列宽调整只影响视觉宽度，不修改 `columns` 配置；如需持久化，请监听 `column-resize` 并在下次渲染时通过 `width` 传回。
- `column-order-change` 返回的 key 顺序可直接保存，下次渲染时按该顺序排列 `columns` 即可恢复。
- 多列排序时，先点击的列优先级更高；取消某一列不会改变其他列的优先级顺序。
- 当前版本提供客户端排序与横向滚动，固定列、虚拟滚动与树形数据在后续版本规划中。
