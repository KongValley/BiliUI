---
title: TimePicker 时间选择
---

# TimePicker 时间选择

选择小时、分钟与秒，支持步长、禁用时间、当前时间快捷填充与清空。

<script setup>
import DemoBasic from '../examples/time-picker/basic.vue'
import basicCode from '../examples/time-picker/basic.vue?raw'
import DemoSteps from '../examples/time-picker/steps.vue'
import stepsCode from '../examples/time-picker/steps.vue?raw'
</script>

## 基础用法

`v-model` 绑定 `HH:mm` 字符串；打开面板选择小时和分钟后点击「确定」提交。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 秒、步长与禁用时间

`show-seconds` 开启秒列并回写 `HH:mm:ss`；`minute-step` / `second-step` 控制列步长，`disabled-minutes` 等函数用于禁用具体时间。

<DemoBlock :code="stepsCode">
  <DemoSteps />
</DemoBlock>

## API

### Props

| 属性               | 说明                             | 类型                         | 默认值         |
| ------------------ | -------------------------------- | ---------------------------- | -------------- |
| `model-value`      | 绑定时间，`HH:mm` 或 `HH:mm:ss`  | `string`                     | `''`           |
| `placeholder`      | 占位文本                         | `string`                     | `'请选择时间'` |
| `size`             | 尺寸                             | `'sm' \| 'md' \| 'lg'`       | `'md'`         |
| `disabled`         | 是否禁用                         | `boolean`                    | `false`        |
| `clearable`        | 是否可清空                       | `boolean`                    | `true`         |
| `show-seconds`     | 显示秒列并回写秒                 | `boolean`                    | `false`        |
| `hour-step`        | 小时步长                         | `number`                     | `1`            |
| `minute-step`      | 分钟步长                         | `number`                     | `1`            |
| `second-step`      | 秒步长                           | `number`                     | `1`            |
| `disabled-hours`   | 返回禁用的小时列表               | `() => number[]`             | —              |
| `disabled-minutes` | 返回指定小时下禁用的分钟列表     | `(hour: number) => number[]` | —              |
| `disabled-seconds` | 返回指定时/分下禁用的秒列表      | `(hour, minute) => number[]` | —              |
| `now-text`         | 「此刻」按钮文案                 | `string`                     | `'此刻'`       |
| `confirm-text`     | 「确定」按钮文案                 | `string`                     | `'确定'`       |
| `popper-class`     | 浮层额外类名，用于多实例主题隔离 | `string`                     | `''`           |
| `z-index`          | 面板层级，省略时自动递增         | `number`                     | —              |

### Events

| 事件名              | 说明           | 回调参数             |
| ------------------- | -------------- | -------------------- |
| `update:modelValue` | 绑定值变化     | `(value: string)`    |
| `change`            | 确认时间或清空 | `(value: string)`    |
| `visible-change`    | 面板显隐变化   | `(visible: boolean)` |
| `clear`             | 点击清空       | —                    |

### Exposes

| 方法                 | 说明            |
| -------------------- | --------------- |
| `open()` / `close()` | 打开 / 关闭面板 |
| `focus()`            | 聚焦触发器      |

## 说明

- 打开面板时会自动滚动到当前选中项；未绑定值时默认使用当前时间作为草稿。
- 列宽与滚动区域固定，选项较多时列内滚动。
- 「此刻」只更新草稿，点击「确定」才会回写 `v-model`。
- 禁用时间通过列过滤实现，若当前草稿值落入禁用范围会自动调整到最近可用值。
- 完整类型定义见 [API 参考](/guide/api)（自动生成）。
