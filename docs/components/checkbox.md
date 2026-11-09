---
title: Checkbox 多选框
---

# Checkbox 多选框

在一组选项中进行多选。配合 `BiliCheckboxGroup` 使用时，`v-model` 绑定数组。

<script setup>
import DemoBasic from '../examples/checkbox/basic.vue'
import basicCode from '../examples/checkbox/basic.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## Checkbox API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 独立使用时绑定布尔值 | `boolean` | `false` |
| `value` | 在组内代表该选项的值 | `string \| number \| boolean` | — |
| `label` | 显示文本，未提供 `value` 时也作为组值 | `string \| number` | — |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `indeterminate` | 是否半选 | `boolean` | `false` |
| `name` | 原生 name | `string` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 独立使用时值变化 | `(value: boolean)` |
| `change` | 独立使用时值变化 | `(value: boolean)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 选项文本 |

## CheckboxGroup API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 绑定数组 | `Array<string \| number \| boolean>` | `[]` |
| `disabled` | 禁用整组 | `boolean` | `false` |
| `min` | 最少选中数量 | `number` | — |
| `max` | 最多选中数量 | `number` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 选中项变化 | `(values: Array)` |
| `change` | 选中项变化 | `(values: Array)` |

## 说明

组内 Checkbox 的 `value` 未设置时会回退到 `label` 作为值；`min` / `max` 达到边界后会阻止对应的勾选/取消操作。
