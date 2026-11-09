---
title: Select 选择器
---

# Select 选择器

下拉选择器，支持单选、搜索过滤、清空与键盘导航，弹层由 Floating UI 定位并自动翻转。

<script setup>
import DemoBasic from '../examples/select/basic.vue'
import basicCode from '../examples/select/basic.vue?raw'
import DemoFilterable from '../examples/select/filterable.vue'
import filterableCode from '../examples/select/filterable.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 搜索与清空

开启 `filterable` 后可在触发器内输入关键字过滤；`clearable` 在有值时显示清空按钮。

<DemoBlock :code="filterableCode">
  <DemoFilterable />
</DemoBlock>

## 键盘交互

| 按键 | 行为 |
| --- | --- |
| `↑` / `↓` | 打开面板或移动高亮项，自动跳过禁用项 |
| `Enter` | 选中高亮项；未打开时打开面板 |
| `Esc` | 关闭面板 |
| `Tab` | 关闭面板并移出焦点 |

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 绑定值 | `string \| number \| null` | — |
| `options` | 选项列表 | `SelectOption[]` | `[]` |
| `placeholder` | 占位文本 | `string` | `'请选择'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `filterable` | 是否可搜索 | `boolean` | `false` |
| `empty-text` | 无数据文案 | `string` | `'暂无数据'` |

`SelectOption` 结构：

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 选中或清空 | `(value, option?)` |
| `change` | 选中或清空 | `(value, option?)` |
| `visible-change` | 面板显隐变化 | `(visible: boolean)` |
| `clear` | 点击清空 | — |
| `focus` / `blur` | 焦点变化 | `(event: FocusEvent)` |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦触发器 |
| `blur()` | 失焦 |
| `open()` / `close()` | 受控打开 / 关闭面板 |

## 说明

- 清空时会发出 `null`，请据此适配业务数据。
- 面板通过 Teleport 挂载到 `body`，并使用 z-index 管理器避免层级冲突。
