---
title: Dropdown 下拉菜单
---

# Dropdown 下拉菜单

通用操作菜单，支持悬停、点击、右键三种触发方式，可承载图标、快捷键提示与分割线。

<script setup>
import DemoBasic from '../examples/dropdown/basic.vue'
import basicCode from '../examples/dropdown/basic.vue?raw'
</script>

## 基础用法

通过 `items` 快速声明菜单，或用 `BiliDropdownItem` 插槽自定义；`command` 事件携带被点击项的 `key`。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Dropdown Props

| 属性           | 说明                             | 类型                                                | 默认值           |
| -------------- | -------------------------------- | --------------------------------------------------- | ---------------- |
| `trigger`      | 触发方式                         | `'hover' \| 'click' \| 'contextmenu'`               | `'hover'`        |
| `placement`    | 弹出位置                         | `'bottom-start' \| 'bottom' \| 'bottom-end' \| ...` | `'bottom-start'` |
| `items`        | 数据驱动菜单项                   | `DropdownItem[]`                                    | `[]`             |
| `disabled`     | 是否禁用                         | `boolean`                                           | `false`          |
| `arrow`        | 是否显示箭头                     | `boolean`                                           | `true`           |
| `showTimeout`  | 悬停展开延迟（ms）               | `number`                                            | `80`             |
| `hideTimeout`  | 悬停收起延迟（ms）               | `number`                                            | `120`            |
| `popper-class` | 浮层额外类名，用于多实例主题隔离 | `string`                                            | `''`             |

`DropdownItem` 字段：`key`、`label`、`icon?`、`disabled?`、`divided?`、`shortcut?`。

### Events

| 事件名           | 说明       | 回调参数                            |
| ---------------- | ---------- | ----------------------------------- |
| `command`        | 点击菜单项 | `(key: string, item: DropdownItem)` |
| `visible-change` | 显隐变化   | `(visible: boolean)`                |

### Slots

| 插槽名     | 说明                       |
| ---------- | -------------------------- |
| `default`  | 触发器内容                 |
| `trigger`  | 触发器内容（包裹在按钮内） |
| `dropdown` | 自定义面板内容             |

### Expose

`open()`、`close()`、`toggle()`。

## 说明

- 面板通过 `Teleport` 渲染到 body，并用 floating-ui 自动翻转以避免溢出视口。
- 悬停触发带展开/收起延迟，指针从触发器移到面板时不会闪烁。
- 展开时箭头旋转 180°，禁用项不可点击且弱化显示。
- 面板最大高度受视口限制，超出后内部滚动。
