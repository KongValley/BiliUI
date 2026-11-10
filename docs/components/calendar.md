---
title: Calendar 日历
---

# Calendar 日历

按月展示日期，用于日期选择、日程面板与数据看板。绑定值为 `YYYY-MM-DD` 字符串。

<script setup>
import DemoBasic from '../examples/calendar/basic.vue'
import basicCode from '../examples/calendar/basic.vue?raw'
import DemoDisabled from '../examples/calendar/disabled.vue'
import disabledCode from '../examples/calendar/disabled.vue?raw'
</script>

## 基础用法

`v-model` 绑定选中日期；未传值时展示当月。左右箭头切换月份，点击日期回写值；跨月日期会同时切换视图。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 禁用日期

`disabled-date` 返回 `true` 的日期不可点击，可用于限制可选范围（如仅工作日）。

<DemoBlock :code="disabledCode">
  <DemoDisabled />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 选中日期，格式 `YYYY-MM-DD` | `string` | `''` |
| `first-day-of-week` | 一周起始日，`0` 周日 / `1` 周一 | `number` | `1` |
| `show-today` | 是否显示「今天」按钮 | `boolean` | `true` |
| `today-text` | 「今天」按钮文案 | `string` | `'今天'` |
| `disabled-date` | 判断日期是否禁用 | `(date: Date) => boolean` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 选中日期变化 | `(value: string)` |
| `change` | 选中日期变化 | `(value: string)` |
| `month-change` | 切换月份 | `(year: number, month: number)`，`month` 为 1–12 |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `prevMonth()` / `nextMonth()` | 切换到上 / 下个月 |
| `selectToday()` | 选中今天 |

## 说明

- 固定渲染 6×7 = 42 个日期格，切换月份时高度不会跳动。
- 相邻月份的日期以弱化样式展示，点击后会自动切换到对应月份。
- `month-change` 的月份从 1 开始计数，便于直接展示。
- 日期使用本地时区构造，避免 `Date` 字符串解析的时区偏移问题。
