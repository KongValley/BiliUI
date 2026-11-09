---
title: Form 表单
---

# Form 表单

表单用于收集、校验与提交数据。`BiliForm` 负责规则注册与统一校验，`BiliFormItem` 负责单个字段的标签、错误信息与触发校验。

<script setup>
import DemoBasic from '../examples/form/basic.vue'
import basicCode from '../examples/form/basic.vue?raw'
import DemoAsync from '../examples/form/async.vue'
import asyncCode from '../examples/form/async.vue?raw'
</script>

## 基础用法

校验规则可写在 Form 的 `rules` 中，也可直接传给 FormItem 的 `rules`。输入框失焦或值变化时会按 `trigger` 自动校验。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 异步校验

`validator` 支持返回 `boolean`、字符串或 Promise。返回字符串时该字符串即错误信息。

<DemoBlock :code="asyncCode">
  <DemoAsync />
</DemoBlock>

## Form API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model` | 表单数据对象 | `Record<string, any>` | `{}` |
| `rules` | 校验规则 | `FormRules` | — |
| `label-width` | 标签宽度 | `string \| number` | `'96px'` |
| `label-position` | 标签位置 | `'left' \| 'right' \| 'top'` | `'right'` |
| `show-message` | 是否显示错误信息 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `validate` | 校验完成后触发 | `(valid: boolean, invalidFields?: Record<string, string>)` |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `validate(callback?)` | 校验全部字段，返回 `Promise<boolean>` |
| `validateField(props, callback?)` | 校验指定字段，返回 `Promise<boolean>` |
| `resetFields()` | 重置为挂载时的初始值并清除校验状态 |
| `clearValidate(props?)` | 清除指定字段（或全部）的校验状态 |

## FormItem API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `prop` | 对应 `model` 中的字段路径，支持 `a.b` | `string` | `''` |
| `label` | 标签文本 | `string` | `''` |
| `rules` | 字段校验规则，与 Form 的 rules 合并 | `FormItemRule \| FormItemRule[]` | — |
| `required` | 是否必填（显示星号） | `boolean` | — |
| `label-width` | 覆盖表单标签宽度 | `string \| number` | — |
| `show-message` | 是否显示错误信息 | `boolean` | — |
| `error` | 手动指定的错误信息 | `string` | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `validate` | 字段校验完成 | `(valid: boolean, message?: string)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 表单控件 |
| `label` | 自定义标签内容 |

## 校验规则

```ts
interface FormItemRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change' | Array<'blur' | 'change'>
  type?: 'string' | 'number' | 'email' | 'url' | 'array'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: (
    value: any,
    rule: FormItemRule,
    model: Record<string, any>
  ) => boolean | string | Promise<boolean | string>
}
```

- 未指定 `trigger` 时，失焦与值变化都会触发校验。
- `min` / `max` 在 `type: 'number'` 下比较数值，其余类型比较长度。
- 表单项挂载时会记录初始值，`resetFields()` 会恢复该值。
