---
title: Transfer 穿梭框
---

# Transfer 穿梭框

双栏列表之间批量移动数据，支持勾选、全选、搜索过滤、禁用项与自定义节点渲染。

<script setup>
import DemoBasic from '../examples/transfer/basic.vue'
import basicCode from '../examples/transfer/basic.vue?raw'
import DemoFilterable from '../examples/transfer/filterable.vue'
import filterableCode from '../examples/transfer/filterable.vue?raw'
</script>

## 基础用法

左侧为未选中数据，右侧为 `v-model` 中的目标 key。勾选后点击中间箭头批量移动；`titles` 自定义两侧标题，禁用项不会被勾选或移动。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 搜索与自定义节点

开启 `filterable` 后两侧各自独立过滤；`item` 插槽可以渲染标签、图标等自定义内容，过滤仍按 `label` 匹配。

<DemoBlock :code="filterableCode">
  <DemoFilterable />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 全部数据 | `TransferItem[]` | `[]` |
| `model-value` | 右侧列表的 key 数组，配合 `v-model` | `Array<string \| number>` | `[]` |
| `titles` | 两侧标题 | `[string, string]` | `['列表 1', '列表 2']` |
| `filterable` | 是否显示搜索框 | `boolean` | `false` |
| `filter-placeholder` | 搜索框占位文本 | `string` | `'请输入关键字'` |
| `disabled` | 是否整体禁用 | `boolean` | `false` |
| `show-select-all` | 是否显示表头全选 | `boolean` | `true` |

`TransferItem` 结构：

```ts
interface TransferItem {
  key: string | number
  label: string
  disabled?: boolean
  [key: string]: any
}
```

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 目标列表变化 | `(keys)` |
| `change` | 移动完成后触发 | `(keys, direction, movedKeys)`，`direction` 为 `'left' \| 'right'` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `item` | 自定义列表项，作用域参数 `{ item, side }`，`side` 为 `'left' \| 'right'` |
| `title` | 自定义面板标题，作用域参数 `{ title, side }` |

## 说明

- 目标列表的展示顺序始终跟随 `data` 的顺序，`model-value` 只决定归属。
- 表头全选只作用于当前过滤结果中的可用项，禁用项不会被选中。
- 勾选状态在搜索过滤时保留，移动后会自动清空对应侧的选择。
- 小屏（≤640px）下自动切换为上下布局，箭头旋转 90°。
