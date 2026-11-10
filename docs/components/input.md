---
title: Input 输入框
---

# Input 输入框

通过鼠标或键盘输入内容，支持密码显隐、清空、字数统计、前后缀插槽与文本域。

<script setup>
import DemoBasic from '../examples/input/basic.vue'
import basicCode from '../examples/input/basic.vue?raw'
import DemoTextarea from '../examples/input/textarea.vue'
import textareaCode from '../examples/input/textarea.vue?raw'
import DemoAddon from '../examples/input/addon.vue'
import addonCode from '../examples/input/addon.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 文本域与插槽

`type="textarea"` 渲染文本域；`prefix` / `suffix` 插槽可放置图标、标签等附加内容。

<DemoBlock :code="textareaCode">
  <DemoTextarea />
</DemoBlock>

## 前后置组合

`prepend` / `append` 插槽在输入框两侧渲染独立区块，适合网址、货币、单位等组合输入。与 `prefix` / `suffix` 不同，前后置块位于输入框边框内部的两端，并与输入区共享同一套边框与圆角。

<DemoBlock :code="addonCode">
  <DemoAddon />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 绑定值 | `string \| number` | `''` |
| `type` | 类型 | `'text' \| 'password' \| 'textarea'` | `'text'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `placeholder` | 占位文本 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `clearable` | 是否显示清空按钮 | `boolean` | `false` |
| `show-password` | 是否显示密码可见切换 | `boolean` | `false` |
| `show-count` | 是否显示字数统计 | `boolean` | `false` |
| `maxlength` | 最大输入长度 | `number` | — |
| `rows` | 文本域行数 | `number` | `2` |
| `autocomplete` | 原生自动完成 | `string` | `'off'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 值变化 | `(value: string)` |
| `input` | 输入时触发 | `(value: string)` |
| `change` | 原生 change 时触发 | `(value: string)` |
| `focus` | 获得焦点 | `(event: FocusEvent)` |
| `blur` | 失去焦点 | `(event: FocusEvent)` |
| `clear` | 点击清空 | — |
| `keydown` | 键盘按下 | `(event: KeyboardEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 输入框头部内容 |
| `suffix` | 输入框尾部内容 |
| `prepend` | 输入框左侧前置区块 |
| `append` | 输入框右侧后置区块 |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦 |
| `blur()` | 失焦 |
| `select()` | 选中文本 |
