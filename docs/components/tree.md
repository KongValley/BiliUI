---
title: Tree 树形控件
---

# Tree 树形控件

用层级结构展示数据，支持展开 / 收起、单选、复选框级联、禁用节点与关键字过滤。

<script setup>
import DemoBasic from '../examples/tree/basic.vue'
import basicCode from '../examples/tree/basic.vue?raw'
import DemoCheckable from '../examples/tree/checkable.vue'
import checkableCode from '../examples/tree/checkable.vue?raw'
</script>

## 基础用法

`data` 为树形数组，默认读取 `label` / `value` / `children`。点击节点更新 `v-model` 并高亮；点击展开按钮显示子节点。`default-expand-all` 在挂载时展开全部层级。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 复选与过滤

开启 `checkable` 后显示复选框，默认父子级联：勾选父节点会选中全部后代，子节点全部勾选时父节点自动勾选，部分勾选显示半选态。`v-model:checked-keys` 双向绑定勾选结果；`check-strictly` 可关闭级联。

`filterable` 在树顶部渲染搜索框，输入关键字后只保留匹配节点及其祖先路径。

<DemoBlock :code="checkableCode">
  <DemoCheckable />
</DemoBlock>

## 受控展开

通过 `v-model:expanded-keys` 控制展开项，`default-expanded-keys` 设置初始展开项；`expand-on-click-node` 让点击整行也能展开。组件实例暴露 `expandAll()` / `collapseAll()` / `clearChecked()`。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 树形数据 | `TreeOption[]` | `[]` |
| `field-names` | 字段映射 | `{ label?, value?, children?, disabled? }` | — |
| `model-value` | 选中节点 key，配合 `v-model` | `string \| number` | — |
| `selectable` | 点击节点是否可选中 | `boolean` | `true` |
| `checkable` | 是否显示复选框 | `boolean` | `false` |
| `checked-keys` | 受控勾选 key，配合 `v-model:checked-keys` | `Array<string \| number>` | — |
| `default-checked-keys` | 初始勾选 key | `Array<string \| number>` | `[]` |
| `expanded-keys` | 受控展开 key，配合 `v-model:expanded-keys` | `Array<string \| number>` | — |
| `default-expanded-keys` | 初始展开 key | `Array<string \| number>` | `[]` |
| `default-expand-all` | 挂载时展开全部 | `boolean` | `false` |
| `check-strictly` | 父子勾选互不影响 | `boolean` | `false` |
| `expand-on-click-node` | 点击节点同时展开 | `boolean` | `false` |
| `filterable` | 是否显示过滤输入框 | `boolean` | `false` |
| `filter-placeholder` | 过滤框占位文本 | `string` | `'请输入关键字'` |
| `empty-text` | 空数据文案 | `string` | `'暂无数据'` |
| `indent` | 每级缩进（px） | `number` | `18` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 选中节点变化 | `(key)` |
| `node-click` | 点击节点 | `(node, key)` |
| `update:checkedKeys` | 勾选变化 | `(keys)` |
| `check-change` | 勾选状态变化 | `(node, checked, keys)` |
| `update:expandedKeys` | 展开项变化 | `(keys)` |
| `expand-change` | 节点展开 / 收起 | `(node, expanded)` |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `expandAll()` | 展开全部有子节点的节点 |
| `collapseAll()` | 收起全部节点 |
| `clearChecked()` | 清空勾选 |

## 说明

- 每个节点需要唯一的 `value`；`field-names` 可映射后端字段。
- 级联勾选时 `checked-keys` 只包含完全勾选的节点，半选父节点通过内部状态渲染。
- 过滤状态下会自动展开匹配节点的祖先路径；清空关键字后恢复原有展开状态。
- 支持键盘操作：`→` 展开、`←` 收起、`Enter` / `Space` 选中或勾选当前节点。
