---
title: Popover 气泡卡片
---

# Popover 气泡卡片

点击或悬停触发的气泡浮层，可承载标题、富文本内容与操作区；`Popconfirm` 是其确认操作变体。

<script setup>
import DemoBasic from '../examples/popover/basic.vue'
import basicCode from '../examples/popover/basic.vue?raw'
</script>

## 基础用法

`Popover` 承载任意内容，`Popconfirm` 提供确认/取消与异步确认。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Popover Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `visible` | 受控显隐，配合 `v-model:visible` | `boolean` | — |
| `title` | 标题 | `string` | `''` |
| `content` | 内容文本 | `string` | `''` |
| `placement` | 出现位置 | floating-ui `Placement` | `'bottom'` |
| `trigger` | 触发方式 | `'hover' \| 'click' \| 'focus'` | `'click'` |
| `width` | 宽度 | `string \| number` | `240` |
| `offset` | 与触发元素的间距 | `number` | `8` |
| `showArrow` | 是否显示箭头 | `boolean` | `true` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `closeOnClickOutside` | 点击外部是否关闭 | `boolean` | `true` |

### Popconfirm Props

继承 `Popover` 的全部属性，另有：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `confirmText` | 确认按钮文案 | `string` | `'确定'` |
| `cancelText` | 取消按钮文案 | `string` | `'取消'` |
| `confirmType` | 确认按钮类型 | `'primary' \| 'danger'` | `'primary'` |
| `onConfirm` | 异步确认，resolve 后关闭 | `() => void \| Promise<unknown>` | — |

### Events

| 事件名 | 说明 |
| --- | --- |
| `update:visible` / `visible-change` | 显隐变化 |
| `confirm` / `cancel` | Popconfirm 的确认与取消 |

### Slots

`Popover`：`reference`（默认）、`title`、`content`、`footer`
`Popconfirm`：`default`、`content`、`actions`

### Expose

`open()`、`close()`、`toggle()`。

## 说明

- 基于 floating-ui 自动避让边缘，箭头位置随定位结果计算。
- `Popconfirm` 的 `onConfirm` 返回 Promise 时按钮进入 loading，直到 promise 结算才关闭。
- 悬停触发带 120ms 收起延迟，鼠标从触发器移入面板不会闪烁。
