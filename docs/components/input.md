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
import DemoVariants from '../examples/input/variants.vue'
import variantsCode from '../examples/input/variants.vue?raw'
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

## 搜索框与验证码

`BiliInputSearch` 在输入框尾部提供搜索按钮，支持 `enter-button` 显示文字、`loading` 加载态与回车搜索；`BiliInputOtp` 把输入拆成固定数量的格子，自动跳格、支持粘贴与遮罩。

<DemoBlock :code="variantsCode">
  <DemoVariants />
</DemoBlock>

### InputSearch Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 输入值 | `string \| number` | `''` |
| `enterButton` | 显示文字搜索按钮 | `boolean \| string` | `false` |
| `loading` | 搜索中状态 | `boolean` | `false` |
| `clearable` | 显示清空按钮 | `boolean` | `false` |
| `size` / `disabled` | 尺寸 / 禁用 | `'sm' \| 'md' \| 'lg'` / `boolean` | 继承 ConfigProvider |

| 事件名 | 说明 |
| --- | --- |
| `search` | 点击按钮或按回车，参数为当前值 |
| `update:modelValue` / `input` / `change` / `clear` | 与 Input 一致 |

### InputOtp Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 已输入字符 | `string` | `''` |
| `length` | 格子数量 | `number` | `6` |
| `mask` | 密码遮罩 | `boolean` | `false` |
| `separator` | 格子之间的分隔符 | `string \| number` | `''` |
| `type` | 键盘类型提示 | `'text' \| 'number'` | `'text'` |

| 事件名 | 说明 |
| --- | --- |
| `update:modelValue` / `change` | 值变化 |
| `complete` | 填满全部格子时触发，参数为完整值 |
| `focus` / `blur` | 聚焦与失焦 |

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
