---
title: InputTag 标签输入
---

# InputTag 标签输入

以标签形式录入多个文本值，支持回车 / 分隔符提交、数量上限、去重、失焦提交与清空。

<script setup>
import DemoBasic from '../examples/input-tag/basic.vue'
import basicCode from '../examples/input-tag/basic.vue?raw'
</script>

## 基础用法

`v-model` 绑定 `string[]`。输入内容后按 `Enter` 或输入逗号（中英文均可）即可生成标签，空输入框按 `Backspace` 删除最后一个标签。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 说明

- `max` 限制标签数量，达到上限后继续输入不会新增。
- `maxlength` 会截断单个标签的字符数。
- 默认不允许重复标签，`allow-duplicate` 可放开限制。
- `delimiter` 可自定义分隔符集合，`trigger="Space"` 改为空格提交。
- `add-on-blur` 默认开启，输入框失焦时会把草稿提交为标签。
- 输入法组合输入期间不会误触发标签提交。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 标签数组 | `string[]` | `[]` |
| `placeholder` | 占位文字 | `string` | `''` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | 继承 ConfigProvider |
| `disabled` / `readonly` | 禁用 / 只读 | `boolean` | `false` |
| `clearable` | 显示清空按钮 | `boolean` | `false` |
| `max` | 最大标签数，0 为不限 | `number` | `0` |
| `maxlength` | 单个标签最大字符数 | `number` | — |
| `allowDuplicate` | 允许重复标签 | `boolean` | `false` |
| `delimiter` | 提交分隔符 | `string \| string[]` | `',，'` |
| `trigger` | 提交按键 | `'Enter' \| 'Space'` | `'Enter'` |
| `addOnBlur` | 失焦提交草稿 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 标签变化 | `(value: string[])` |
| `change` | 标签变化 | `(value: string[])` |
| `add` | 新增标签 | `(value: string)` |
| `remove` | 移除标签 | `(value: string, index: number)` |
| `clear` | 清空 | — |
| `focus` / `blur` | 聚焦与失焦 | `(event: FocusEvent)` |

### Exposes

| 名称 | 说明 |
| --- | --- |
| `focus` / `blur` | 聚焦 / 失焦输入框 |
| `inputRef` | 原生输入框元素 |
