---
title: TimeSelect 固定时间选择
---

# TimeSelect 固定时间选择

从固定的时间点列表中选择，而不是自由输入时分秒；适合预约、排班、会议时段等场景。

<script setup>
import DemoBasic from '../examples/time-select/basic.vue'
import basicCode from '../examples/time-select/basic.vue?raw'
</script>

## 基础用法

默认生成 `09:00` 到 `18:00`、每 30 分钟一档的选项。通过 `start` / `end` / `step` 控制区间与步长，或直接传入 `options`。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 说明

- 选择后立即提交并关闭面板，`v-model` 为 `HH:mm` 字符串。
- 支持键盘操作：`↑` / `↓` 移动高亮，`Enter` 确认，`Esc` 关闭。
- `options` 非空时优先使用固定列表，忽略 `start` / `end` / `step`。
- 与 `BiliTimePicker` 的区别：TimePicker 允许任意时/分/秒，TimeSelect 只能选择预设时间点。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 选中时间 | `string` | `''` |
| `start` | 起始时间 | `string` | `'09:00'` |
| `end` | 结束时间（含） | `string` | `'18:00'` |
| `step` | 间隔 | `string` | `'00:30'` |
| `options` | 固定时间点列表 | `string[]` | `[]` |
| `placeholder` | 占位文字 | `string` | 国际化「请选择时间」 |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | 继承 ConfigProvider |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 显示清空按钮 | `boolean` | `true` |
| `popperClass` | 面板额外类名 | `string` | `''` |
| `zIndex` | 面板层级 | `number` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 值变化 | `(value: string)` |
| `change` | 值变化 | `(value: string)` |
| `visible-change` | 面板开关 | `(visible: boolean)` |
| `clear` | 清空 | — |

### Exposes

| 名称 | 说明 |
| --- | --- |
| `open` / `close` | 打开 / 关闭面板 |
| `focus` | 聚焦触发器 |
