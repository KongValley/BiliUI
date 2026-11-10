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
import DemoFormList from '../examples/form/form-list.vue'
import formListCode from '../examples/form/form-list.vue?raw'
import DemoDependency from '../examples/form/dependency.vue'
import dependencyCode from '../examples/form/dependency.vue?raw'
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

## 动态增减字段

`FormList` 渲染一个数组字段，默认插槽会拿到 `{ item, index, field, add, remove, move }`。内部的 `FormItem` 使用**相对路径**（如 `prop="name"`），组件会自动拼接为 `members.0.name`，校验与 `resetFields` 都基于完整路径。顶层的 `FormItem` 用 `prop="members"` 包住列表即可。

<DemoBlock :code="formListCode">
  <DemoFormList />
</DemoBlock>

## 跨字段依赖校验

在规则的 `dependencies` 中声明依赖字段，当依赖字段变化时会自动重新校验当前字段。`validator` 的第三个参数是完整的表单模型，也可以直接做交叉比较。

<DemoBlock :code="dependencyCode">
  <DemoDependency />
</DemoBlock>

## 局部校验与滚动定位

`validateFields(props?, callback?)` 只校验指定字段（省略参数时校验全部），回调会带回错误信息映射；`validateField` 保留原有签名。开启 `scroll-to-error` 后，`validate()` 失败会自动滚动到第一个错误字段；也可以手动调用 `scrollToFirstError()`。

```ts
const valid = await formRef.value.validateFields(['username', 'email'], (ok, errors) => {
  if (!ok) console.log(errors) // { username: '请输入用户名' }
})
```

## Form API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model` | 表单数据对象 | `Record<string, any>` | `{}` |
| `rules` | 校验规则 | `FormRules` | — |
| `label-width` | 标签宽度 | `string \| number` | `'96px'` |
| `label-position` | 标签位置 | `'left' \| 'right' \| 'top'` | `'right'` |
| `show-message` | 是否显示错误信息 | `boolean` | `true` |
| `scroll-to-error` | 校验失败后滚动到第一个错误字段 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `validate` | 校验完成后触发 | `(valid: boolean, invalidFields?: Record<string, string>)` |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `validate(callback?)` | 校验全部字段，返回 `Promise<boolean>` |
| `validateField(props, callback?)` | 校验指定字段，返回 `Promise<boolean>` |
| `validateFields(props?, callback?)` | 局部校验并回报错误映射，省略参数时等价于 `validate` |
| `resetFields()` | 重置为挂载时的初始值并清除校验状态 |
| `clearValidate(props?)` | 清除指定字段（或全部）的校验状态 |
| `scrollToFirstError()` | 滚动到第一个带错误信息的字段 |

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

## FormList API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 绑定的数组字段，配合 `v-model` 使用 | `any[]` | `[]` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 数组变化 | `(items: any[])` |
| `add` | 新增一项后触发 | `(index: number)` |
| `remove` | 移除一项后触发 | `(index: number)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 每一项的内容，作用域参数 `{ item, index, field, add, remove, move }` |
| `footer` | 列表底部操作区，作用域参数 `{ add }` |

作用域方法：

- `add(value?, index?)`：追加一项；只传数字时视为插入位置并创建空对象；也可传入初始值与插入位置。
- `remove(index)`：移除指定项。
- `move(from, to)`：调整项顺序。

`field` 是当前项的完整模型路径（如 `members.2`），可直接用于调试或自定义逻辑。

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
  dependencies?: string[]
  validator?: (
    value: any,
    rule: FormItemRule,
    model: Record<string, any>
  ) => boolean | string | Promise<boolean | string>
}
```

- 未指定 `trigger` 时，失焦与值变化都会触发校验。
- `Input`、`Select`、`Checkbox`、`Radio`、`Switch`、`InputNumber` 等控件会在失焦或值变化时自动触发所在 `FormItem` 的校验。
- `min` / `max` 在 `type: 'number'` 下比较数值，其余类型比较长度。
- 表单项挂载时会记录初始值，`resetFields()` 会恢复该值。
- `dependencies` 在 `FormList` 内可直接写兄弟字段名（如 `password`），组件会自动补全为当前项的完整路径；也可以直接写完整路径。
- `FormList` 内错误信息的 key 同样是完整路径（如 `members.0.name`），局部校验时可直接按该路径传入。
