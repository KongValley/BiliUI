---
title: Table 表格
---

# Table 表格

用于展示结构化数据，支持列配置、排序、斑马纹、边框、加载态与自定义单元格，并支持**固定列 / 固定表头**、**展开行**、**树形数据**、**合计行**、**虚拟滚动**、表头拖拽换列、拖拽调整列宽与多列排序。

<script setup>
import DemoBasic from '../examples/table/basic.vue'
import basicCode from '../examples/table/basic.vue?raw'
import DemoAdvanced from '../examples/table/advanced.vue'
import advancedCode from '../examples/table/advanced.vue?raw'
import DemoDrag from '../examples/table/drag.vue'
import dragCode from '../examples/table/drag.vue?raw'
import DemoSorting from '../examples/table/sorting.vue'
import sortingCode from '../examples/table/sorting.vue?raw'
import DemoSelection from '../examples/table/selection.vue'
import selectionCode from '../examples/table/selection.vue?raw'
import DemoSelectionAdvanced from '../examples/table/selection-advanced.vue'
import selectionAdvancedCode from '../examples/table/selection-advanced.vue?raw'
import DemoFixed from '../examples/table/fixed.vue'
import fixedCode from '../examples/table/fixed.vue?raw'
import DemoExpand from '../examples/table/expand.vue'
import expandCode from '../examples/table/expand.vue?raw'
import DemoTree from '../examples/table/tree.vue'
import treeCode from '../examples/table/tree.vue?raw'
import DemoSummary from '../examples/table/summary.vue'
import summaryCode from '../examples/table/summary.vue?raw'
import DemoVirtual from '../examples/table/virtual.vue'
import virtualCode from '../examples/table/virtual.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 固定列与固定表头

给列配置 `fixed: 'left' | 'right'` 可将列固定在左右两侧，横向滚动时保持可见；配合 `max-height` 开启纵向滚动，表头会自动吸顶。固定列建议显式设置 `width`，未设置时按 120px 参与定位计算。

<DemoBlock :code="fixedCode">
  <DemoFixed />
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

## 勾选

开启 `selection` 后会在首列渲染复选框，表头复选框支持全选与半选。用 `v-model:selected-keys` 双向绑定选中行的 key（需要配合 `row-key`，否则回退到行索引）。

<DemoBlock :code="selectionCode">
  <DemoSelection />
</DemoBlock>

### 行禁用与整行点击

`selectable` 返回 `false` 的行复选框不可用，也不会被全选选中；开启 `select-on-click-row` 后点击行任意非交互区域即可切换选中，行内按钮、链接等元素不受影响。

<DemoBlock :code="selectionAdvancedCode">
  <DemoSelectionAdvanced />
</DemoBlock>

## 展开行

开启 `expandable` 后每行前会多出展开按钮，通过 `expand` 插槽渲染详情内容。使用 `v-model:expanded-row-keys` 控制展开项，`row-expandable` 可限制哪些行允许展开，`default-expand-all` 在挂载时展开全部。

<DemoBlock :code="expandCode">
  <DemoExpand />
</DemoBlock>

## 树形数据

数据项包含子数组（默认字段 `children`）时自动进入树形模式，配合 `row-key` 稳定标识节点。`tree-props` 可改字段名，`indent-size` 控制每级缩进；`v-model:expanded-keys` 控制展开节点，`default-expand-all` 展开全部。若 `tree-props.has-children` 指定的字段为 `true`，即使没有子数组也会显示展开按钮，便于按需加载。

<DemoBlock :code="treeCode">
  <DemoTree />
</DemoBlock>

## 合计行

开启 `show-summary` 显示表脚。默认对数值列自动求和并在首列显示 `summary-text`；传入 `summary-method` 可完全自定义，返回数组与 `columns` 顺序一一对应。

<DemoBlock :code="summaryCode">
  <DemoSummary />
</DemoBlock>

## 虚拟滚动

大数据量时开启 `virtual` 并配合 `max-height`，只渲染可视区域附近的行。`virtual-row-height` 需与真实行高保持一致，否则滚动位置会出现偏差。虚拟滚动与树形数据、展开行互斥。

<DemoBlock :code="virtualCode">
  <DemoVirtual />
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
| `max-height` | 纵向滚动高度，开启后表头吸顶 | `string \| number` | — |
| `draggable-columns` | 是否允许拖动表头调整列顺序 | `boolean` | `false` |
| `resizable-columns` | 是否允许拖动表头边界调整列宽 | `boolean` | `true` |
| `resize-sensitivity` | 每拖动 1px 对应的列宽变化 | `number` | `1` |
| `min-column-width` | 列宽下限（px） | `number` | `60` |
| `multi-sort` | 是否允许 `Shift` 点击叠加多列排序 | `boolean` | `false` |
| `selection` | 是否显示勾选列 | `boolean` | `false` |
| `selected-keys` | 选中行的 key，配合 `v-model:selected-keys` 使用 | `Array<string \| number>` | — |
| `selectable` | 判断某行是否可勾选 | `(row, index) => boolean` | — |
| `select-on-click-row` | 是否允许点击整行切换选中 | `boolean` | `false` |
| `selection-width` | 勾选列宽度（px） | `number` | `48` |
| `expandable` | 是否显示展开列 | `boolean` | `false` |
| `expanded-row-keys` | 展开的详情行 key，配合 `v-model:expanded-row-keys` | `Array<string \| number>` | — |
| `expanded-keys` | 展开的树节点 key，配合 `v-model:expanded-keys` | `Array<string \| number>` | — |
| `default-expand-all` | 挂载时展开全部树节点与详情行 | `boolean` | `false` |
| `row-expandable` | 判断某行是否可展示详情 | `(row, index) => boolean` | — |
| `expand-width` | 展开列宽度（px） | `number` | `40` |
| `tree-props` | 树形字段映射 | `{ children?: string; hasChildren?: string }` | `{ children: 'children' }` |
| `indent-size` | 树形每级缩进（px） | `number` | `16` |
| `show-summary` | 是否显示合计行 | `boolean` | `false` |
| `summary-method` | 自定义合计行内容 | `({ columns, data }) => Array<string \| number>` | — |
| `summary-text` | 默认合计行首列文案 | `string` | `'合计'` |
| `virtual` | 是否开启虚拟滚动 | `boolean` | `false` |
| `virtual-row-height` | 虚拟滚动假定的行高（px） | `number` | `44` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `sort-change` | 排序变化 | `{ prop, order, sorts }`，`order` 为 `'asc' \| 'desc' \| null`，`sorts` 为按优先级排列的完整排序状态 |
| `column-order-change` | 拖动表头改变列顺序后触发 | `(order: string[])`，元素为各列的 key（`prop` 或 `slot`） |
| `column-resize` | 拖动边界调整列宽后触发 | `(key: string, width: number)` |
| `update:selectedKeys` | 选中项变化（`v-model:selected-keys`） | `(keys: Array<string \| number>)` |
| `selection-change` | 选中项变化 | `{ keys, rows, row? }` |
| `select` | 单行选中状态变化 | `{ keys, rows, row }` |
| `select-all` | 表头全选 / 取消全选 | `{ keys, rows }` |
| `update:expandedRowKeys` | 详情展开项变化（`v-model:expanded-row-keys`） | `(keys: Array<string \| number>)` |
| `update:expandedKeys` | 树节点展开项变化（`v-model:expanded-keys`） | `(keys: Array<string \| number>)` |
| `expand-row-change` | 详情行展开 / 收起 | `(row, expanded)` |
| `expand-change` | 树节点展开 / 收起 | `(row, expanded)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `cell-<prop>` | 自定义某一列单元格，作用域参数 `{ row, column, value, index }` |
| `header-<prop>` | 自定义某一列表头，作用域参数 `{ column }` |
| `expand` | 展开行内容，作用域参数 `{ row, index }` |
| `empty` | 空状态内容 |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `clearSelection()` | 清空勾选 |
| `toggleAllSelection(checked?)` | 全选 / 取消全选 |
| `selectedRows` | 当前选中的行数据 |
| `toggleRowExpansion(row, expanded?)` | 展开 / 收起指定详情行 |

### TableColumn

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `prop` | 取值字段，支持 `a.b` 路径 | `string` |
| `label` | 表头文本 | `string` |
| `width` | 列宽 | `string \| number` |
| `minWidth` | 最小列宽 | `string \| number` |
| `fixed` | 固定列方向 | `'left' \| 'right'` |
| `align` | 对齐方式 | `'left' \| 'center' \| 'right'` |
| `sortable` | 是否可排序 | `boolean` |
| `sortMethod` | 自定义比较函数，返回负数/0/正数 | `(a, b) => number` |
| `resizable` | 该列是否允许拖动调整宽度，默认跟随表格配置 | `boolean` |
| `formatter` | 单元格格式化函数 | `(row, column, value, index) => string` |
| `slot` | 自定义插槽后缀，默认使用 `prop` | `string` |
| `className` | 单元格附加类名 | `string` |

## 说明

- **勾选**通过 `row-key` 建立行身份，排序或列拖拽改变位置后选中状态依然保持；未传 `row-key` 时回退到行索引，排序后可能错位，建议始终提供。
- 全选只会选中当前 `data` 中通过 `selectable` 校验的行；已有但不在当前数据中的 key 会被保留（便于跨页多选）。
- **列拖拽**与**列宽拖拽**互不干扰：拖动表头主体换顺序，拖动表头右边界改宽度；拖拽过程中点击不会触发排序。
- 列宽调整只影响视觉宽度，不修改 `columns` 配置；如需持久化，请监听 `column-resize` 并在下次渲染时通过 `width` 传回。
- `column-order-change` 返回的 key 顺序可直接保存，下次渲染时按该顺序排列 `columns` 即可恢复。
- 多列排序时，先点击的列优先级更高；取消某一列不会改变其他列的优先级顺序。
- 树形数据同样参与排序：先对每一层级排序，再按展开状态拍平渲染。
- `max-height` 同时启用固定表头与表尾（合计行），表头、合计行在纵向滚动时保持可见。
- 虚拟滚动只渲染可视窗口附近的行，适合上千条数据；开启后不要同时使用树形数据或展开行。
