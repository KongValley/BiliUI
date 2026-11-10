---
title: TreeSelect 树选择
---

# TreeSelect 树选择

下拉面板中嵌入树形结构，支持单选、多选、标签折叠、搜索与清空，适合组织架构、分类目录等场景。

<script setup>
import DemoBasic from '../examples/tree-select/basic.vue'
import basicCode from '../examples/tree-select/basic.vue?raw'
import DemoMultiple from '../examples/tree-select/multiple.vue'
import multipleCode from '../examples/tree-select/multiple.vue?raw'
</script>

## 基础用法

单选模式下点击任意节点即可写回 `v-model` 并关闭面板；`default-expand-all` 让树默认展开，`filterable`（默认开启）在面板顶部提供搜索框。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 多选

开启 `multiple` 后使用复选框，绑定值变为数组，面板保持打开。选中的节点以标签展示，`max-tag-count` 控制折叠数量，超出部分显示为 `+N`；点击标签上的关闭按钮可单独移除。

<DemoBlock :code="multipleCode">
  <DemoMultiple />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 绑定值，多选时为数组 | `string \| number \| Array<string \| number> \| null` | — |
| `data` | 树形数据 | `TreeOption[]` | `[]` |
| `field-names` | 字段映射 | `{ label?, value?, children?, disabled? }` | — |
| `placeholder` | 占位文本 | `string` | `'请选择'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `multiple` | 多选（复选框） | `boolean` | `false` |
| `max-tag-count` | 最多展示的标签数 | `number` | — |
| `check-strictly` | 多选时父子勾选互不影响 | `boolean` | `false` |
| `default-expand-all` | 展开全部节点 | `boolean` | `false` |
| `filterable` | 面板内是否显示搜索框 | `boolean` | `true` |
| `filter-placeholder` | 搜索框占位文本 | `string` | `'搜索节点'` |
| `empty-text` | 空数据文案 | `string` | `'暂无数据'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 选中或取消 | `(value)`，多选时 `value` 为数组 |
| `change` | 选中或取消 | `(value, nodes)`，`nodes` 为对应的节点数组 |
| `visible-change` | 面板显隐变化 | `(visible: boolean)` |
| `clear` | 点击清空 | — |
| `focus` / `blur` | 焦点变化 | `(event: FocusEvent)` |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `focus()` / `blur()` | 聚焦 / 失焦触发器 |
| `open()` / `close()` | 打开 / 关闭面板 |

## 说明

- 单选清空时发出 `null`，多选清空时发出空数组。
- 多选内部复用 `Tree` 的级联勾选逻辑，`checked-keys` 只包含完全勾选的节点。
- 搜索基于节点 label 做不区分大小写的包含匹配，并自动保留祖先路径。
- 节点需提供唯一 `value`，后端字段不同可通过 `field-names` 映射。
