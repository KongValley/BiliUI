---
title: CascaderPanel 级联面板
---

# CascaderPanel 级联面板

不带输入框的级联选择面板，适合直接嵌入弹层、侧边栏或表单区域。

<script setup>
import DemoBasic from '../examples/cascader-panel/basic.vue'
import basicCode from '../examples/cascader-panel/basic.vue?raw'
</script>

## 基础用法

面板与 `BiliCascader` 共用同一套选项结构与字段映射，`v-model` 绑定叶子节点的 value。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 说明

- 点击有子节点的选项会展开下一列，不提交值；叶子节点点击后提交。
- `change-on-select` 允许点击父节点时立即提交，适合「省份可选可不选」的场景。
- `fieldNames` 可把 `label` / `value` / `children` / `disabled` 映射到业务字段。
- 外部修改 `modelValue` 或 `options` 时，面板会自动定位到对应的节点路径。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前值 | `string \| number \| null` | — |
| `options` | 级联选项 | `TreeOption[]` | `[]` |
| `fieldNames` | 字段映射 | `{ label?: string; value?: string; children?: string; disabled?: string }` | — |
| `changeOnSelect` | 父节点点击即提交 | `boolean` | `false` |
| `emptyText` | 空状态文案 | `string` | 国际化「暂无数据」 |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 选中值变化 | `(value: string \| number \| null)` |
| `change` | 选中值变化 | `(value, path: TreeOption[])` |

### Exposes

| 名称 | 说明 |
| --- | --- |
| `activePath` | 当前展开路径 |
| `syncActivePath` | 按 `modelValue` 重新同步展开路径 |
