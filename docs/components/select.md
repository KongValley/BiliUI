---
title: Select 选择器
---

# Select 选择器

下拉选择器，支持单选、多选、分组、本地/远程搜索、标签折叠、全选、虚拟滚动与键盘导航，弹层由 Floating UI 定位并自动翻转。

<script setup>
import DemoBasic from '../examples/select/basic.vue'
import basicCode from '../examples/select/basic.vue?raw'
import DemoFilterable from '../examples/select/filterable.vue'
import filterableCode from '../examples/select/filterable.vue?raw'
import DemoMultiple from '../examples/select/multiple.vue'
import multipleCode from '../examples/select/multiple.vue?raw'
import DemoGroup from '../examples/select/group.vue'
import groupCode from '../examples/select/group.vue?raw'
import DemoRemote from '../examples/select/remote.vue'
import remoteCode from '../examples/select/remote.vue?raw'
import DemoVirtual from '../examples/select/virtual.vue'
import virtualCode from '../examples/select/virtual.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 搜索与清空

开启 `filterable` 后可在触发器内输入关键字过滤；`clearable` 在有值时显示清空按钮。

<DemoBlock :code="filterableCode">
  <DemoFilterable />
</DemoBlock>

## 多选与标签

开启 `multiple` 后绑定值变为数组，选中项以标签展示，面板保持打开。`max-tag-count` 控制最多展示的标签数，超出部分折叠为 `+N`；`select-all` 在面板顶部提供全选行，全选只包含当前可见且未禁用的选项。

<DemoBlock :code="multipleCode">
  <DemoMultiple />
</DemoBlock>

## 分组选项

`options` 中带 `options` 子数组的项会被视为分组，渲染为不可选的分组标题。分组与多选、搜索可以同时使用。

<DemoBlock :code="groupCode">
  <DemoGroup />
</DemoBlock>

## 远程搜索

开启 `remote` 后不再本地过滤，每次输入都会调用 `remote-method(query)`。方法返回 Promise 时组件会自动维护加载态，也可以配合 `loading` 属性自行控制。

<DemoBlock :code="remoteCode">
  <DemoRemote />
</DemoBlock>

## 虚拟滚动

选项超过 `virtual-threshold`（默认 200）条时自动开启虚拟滚动，只渲染可视区域内的选项；也可用 `virtual` 强制开启。通过 `item-height` 与 `panel-max-height` 调整行高和面板高度。分组列表不会启用虚拟滚动。

<DemoBlock :code="virtualCode">
  <DemoVirtual />
</DemoBlock>

## 键盘交互

| 按键        | 行为                                                     |
| ----------- | -------------------------------------------------------- |
| `↑` / `↓`   | 打开面板或移动高亮项，自动跳过禁用项                     |
| `Enter`     | 选中高亮项；多选时切换选中且不关闭面板；未打开时打开面板 |
| `Backspace` | 多选且输入框为空时移除最后一个标签                       |
| `Esc`       | 关闭面板                                                 |
| `Tab`       | 关闭面板并移出焦点                                       |

## API

### Props

| 属性                | 说明                              | 类型                                                  | 默认值       |
| ------------------- | --------------------------------- | ----------------------------------------------------- | ------------ |
| `model-value`       | 绑定值，多选时为数组              | `string \| number \| Array<string \| number> \| null` | —            |
| `options`           | 选项列表，可包含分组              | `SelectOptionItem[]`                                  | `[]`         |
| `placeholder`       | 占位文本                          | `string`                                              | `'请选择'`   |
| `size`              | 尺寸                              | `'sm' \| 'md' \| 'lg'`                                | `'md'`       |
| `disabled`          | 是否禁用                          | `boolean`                                             | `false`      |
| `clearable`         | 是否可清空                        | `boolean`                                             | `false`      |
| `filterable`        | 是否可搜索                        | `boolean`                                             | `false`      |
| `multiple`          | 是否多选                          | `boolean`                                             | `false`      |
| `max-tag-count`     | 最多展示的标签数，超出折叠为 `+N` | `number`                                              | —            |
| `select-all`        | 多选时显示全选行                  | `boolean`                                             | `false`      |
| `filter-method`     | 自定义本地过滤                    | `(query, option) => boolean`                          | —            |
| `remote`            | 使用远程搜索，不做本地过滤        | `boolean`                                             | `false`      |
| `remote-method`     | 输入关键字时调用，可返回 Promise  | `(query) => void \| Promise<void>`                    | —            |
| `loading`           | 外部控制的加载态                  | `boolean`                                             | `false`      |
| `virtual`           | 强制开启虚拟滚动                  | `boolean`                                             | —            |
| `virtual-threshold` | 自动开启虚拟滚动的选项数          | `number`                                              | `200`        |
| `item-height`       | 虚拟列表行高（px）                | `number`                                              | `34`         |
| `panel-max-height`  | 面板列表最大高度（px）            | `number`                                              | `264`        |
| `empty-text`        | 无数据文案                        | `string`                                              | `'暂无数据'` |
| `popper-class`      | 浮层额外类名，用于多实例主题隔离  | `string`                                              | `''`         |

选项结构：

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

type SelectOptionItem = SelectOption | SelectOptionGroup
```

### Events

| 事件名              | 说明             | 回调参数                                  |
| ------------------- | ---------------- | ----------------------------------------- |
| `update:modelValue` | 选中、取消或清空 | `(value, option?)`，多选时 `value` 为数组 |
| `change`            | 选中、取消或清空 | `(value, option?)`                        |
| `visible-change`    | 面板显隐变化     | `(visible: boolean)`                      |
| `clear`             | 点击清空         | —                                         |
| `focus` / `blur`    | 焦点变化         | `(event: FocusEvent)`                     |

### Exposes

| 方法                 | 说明                |
| -------------------- | ------------------- |
| `focus()`            | 聚焦触发器          |
| `blur()`             | 失焦                |
| `open()` / `close()` | 受控打开 / 关闭面板 |

## 说明

- 单选清空时发出 `null`，多选清空时发出空数组，请据此适配业务数据。
- 多选值保持选择顺序；通过 `v-model` 传入的数组顺序决定标签顺序。
- `remote-method` 返回 Promise 时会自动显示加载态；使用回调式远程请求时，请配合 `loading` 属性。
- 虚拟滚动仅作用于平面选项列表；分组列表始终完整渲染。
- 面板通过 Teleport 挂载到 `body`，并使用 z-index 管理器避免层级冲突。
