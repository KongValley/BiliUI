---
title: DatePicker 日期选择
---

# DatePicker 日期选择

选择日期或日期区间，支持日/月/年视图、范围选择、快捷选项、禁用日期与清空。

<script setup>
import DemoBasic from '../examples/date-picker/basic.vue'
import basicCode from '../examples/date-picker/basic.vue?raw'
import DemoRange from '../examples/date-picker/range.vue'
import rangeCode from '../examples/date-picker/range.vue?raw'
import DemoDisabled from '../examples/date-picker/disabled.vue'
import disabledCode from '../examples/date-picker/disabled.vue?raw'
</script>

## 基础用法

`v-model` 绑定 `YYYY-MM-DD` 字符串；点击触发器打开面板，点击日期完成选择。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 日期区间与快捷选项

`type="daterange"` 时绑定 `[start, end]`；`shortcuts` 会在面板左侧渲染快捷项，`value` 可以是值或返回值的函数。

<DemoBlock :code="rangeCode">
  <DemoRange />
</DemoBlock>

## 禁用日期

`disabled-date` 接收日期并返回是否禁用；被禁用的日期不可点击，快捷项也会跳过。

<DemoBlock :code="disabledCode">
  <DemoDisabled />
</DemoBlock>

## API

### Props

| 属性                | 说明                                               | 类型                                 | 默认值         |
| ------------------- | -------------------------------------------------- | ------------------------------------ | -------------- |
| `model-value`       | 绑定值，单日为 `YYYY-MM-DD`，区间为 `[start, end]` | `string \| [string, string] \| null` | `null`         |
| `type`              | 选择类型                                           | `'date' \| 'daterange'`              | `'date'`       |
| `placeholder`       | 单日占位文本                                       | `string`                             | `'请选择日期'` |
| `start-placeholder` | 区间开始占位文本                                   | `string`                             | `'开始日期'`   |
| `end-placeholder`   | 区间结束占位文本                                   | `string`                             | `'结束日期'`   |
| `range-separator`   | 区间分隔符                                         | `string`                             | `'至'`         |
| `size`              | 尺寸                                               | `'sm' \| 'md' \| 'lg'`               | `'md'`         |
| `disabled`          | 是否禁用                                           | `boolean`                            | `false`        |
| `clearable`         | 是否可清空                                         | `boolean`                            | `true`         |
| `first-day-of-week` | 每周第一天，`0` 为周日                             | `number`                             | `1`            |
| `disabled-date`     | 返回 true 时禁用该日期                             | `(date: Date) => boolean`            | —              |
| `shortcuts`         | 快捷选项                                           | `DatePickerShortcut[]`               | `[]`           |
| `popper-class`      | 浮层额外类名，用于多实例主题隔离                   | `string`                             | `''`           |
| `z-index`           | 面板层级，省略时自动递增                           | `number`                             | —              |

### DatePickerShortcut

```ts
interface DatePickerShortcut {
  text: string
  value: string | [string, string] | (() => string | [string, string])
}
```

### Events

| 事件名              | 说明           | 回调参数                   |
| ------------------- | -------------- | -------------------------- |
| `update:modelValue` | 绑定值变化     | `(value: DatePickerValue)` |
| `change`            | 选择完成或清空 | `(value: DatePickerValue)` |
| `visible-change`    | 面板显隐变化   | `(visible: boolean)`       |
| `clear`             | 点击清空       | —                          |

### Exposes

| 方法                 | 说明            |
| -------------------- | --------------- |
| `open()` / `close()` | 打开 / 关闭面板 |
| `focus()`            | 聚焦触发器      |

## 说明

- 面板通过 `Teleport` 挂载到 `body`，使用 floating-ui 定位，点击外部或按 `Esc` 关闭。
- 点击标题可在「日 → 月 → 年」视图间切换；月视图和年视图可直接跳转。
- 区间模式下第一次点击设置起点，第二次点击完成选择；反向点击会自动交换起止顺序。
- 快捷项的值会经过 `disabled-date` 校验，包含禁用日期时不会应用。
- 完整类型定义见 [API 参考](/guide/api)（自动生成）。
