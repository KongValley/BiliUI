---
title: Radio 单选框
---

# Radio 单选框

在一组互斥选项中选择一个，配合 `BiliRadioGroup` 使用。

<script setup>
import DemoBasic from '../examples/radio/basic.vue'
import basicCode from '../examples/radio/basic.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## Radio API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 独立使用时绑定值 | `string \| number \| boolean` | — |
| `value` | 该选项的值 | `string \| number \| boolean` | — |
| `label` | 显示文本，未提供 `value` 时也作为值 | `string \| number` | — |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `name` | 原生 name | `string` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 独立使用时值变化 | `(value)` |
| `change` | 独立使用时值变化 | `(value)` |

## RadioGroup API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 选中值 | `string \| number \| boolean` | — |
| `disabled` | 禁用整组 | `boolean` | `false` |
| `name` | 原生 name，作用于组内单选框 | `string` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 选中值变化 | `(value)` |
| `change` | 选中值变化 | `(value)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 组内单选项 |
