---
title: InputNumber 数字输入
---

# InputNumber 数字输入

用于需要精确输入的数值场景，支持步进、精度控制与范围约束。

<script setup>
import DemoSlider from '../examples/slider/basic.vue'
import sliderCode from '../examples/slider/basic.vue?raw'
</script>

## 基础用法

`v-model` 绑定数值，`step` 与 `precision` 控制步长与小数位，失焦时自动收敛到 `[min, max]`。

<DemoBlock :code="sliderCode">
  <DemoSlider />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前值 | `number` | — |
| `min` / `max` | 取值范围 | `number` | `-Infinity` / `Infinity` |
| `step` | 步长 | `number` | `1` |
| `precision` | 保留小数位 | `number` | 由 `step` 推导 |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `controls` | 显示步进按钮 | `boolean` | `true` |
| `placeholder` | 占位文字 | `string` | `''` |
| `formatter` | 显示格式化 | `(value: number \| undefined) => string` | — |
| `parser` | 输入解析 | `(value: string) => number` | — |
| `align` | 文本对齐 | `'left' \| 'center' \| 'right'` | `'left'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 值变化 | `(value: number \| undefined)` |
| `change` | 用户确认修改 | `(value: number \| undefined)` |
| `focus` / `blur` | 聚焦与失焦 | `(event: FocusEvent)` |

## 说明

- 聚焦期间输入框保留原始文本，不会因约束重排导致光标跳动；失焦时才做范围与精度处理。
- 步进按钮在到达 `min` / `max` 时自动禁用。
- 支持 `↑` / `↓` 方向键调整，`Enter` 提交并失焦。
- 清空输入会 emit `undefined`，便于与后端「未填写」语义对齐。
- 放在 `FormItem` 中时会像 `Input` 一样在值变化 / 失焦时触发校验，错误态会显示在表单上。
