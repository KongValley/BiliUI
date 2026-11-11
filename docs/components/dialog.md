---
title: Dialog 对话框
---

# Dialog 对话框

在浮层中承载需要聚焦处理的内容，支持遮罩关闭、Esc 关闭、滚动锁定与焦点管理。

<script setup>
import DemoBasic from '../examples/dialog/basic.vue'
import basicCode from '../examples/dialog/basic.vue?raw'
import DemoCustom from '../examples/dialog/custom.vue'
import customCode from '../examples/dialog/custom.vue?raw'
import DemoImperative from '../examples/dialog/imperative.vue'
import imperativeCode from '../examples/dialog/imperative.vue?raw'
</script>

## 基础用法

使用 `v-model` 控制显隐，通过 `footer` 插槽放置操作按钮。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 自定义配置

支持自定义头部、宽度与顶部距离；`show-close` 可隐藏默认关闭按钮。

<DemoBlock :code="customCode">
  <DemoCustom />
</DemoBlock>

## 命令式调用

`BiliDialog.confirm` / `alert` / `prompt` 是 `BiliMessageBox` 的别名，适合删除确认、离开页面确认等无需在模板中维护 `v-model` 的场景。

<DemoBlock :code="imperativeCode">
  <DemoImperative />
</DemoBlock>

详细参数见 [MessageBox 消息确认](/components/message-box)。

## API

### Props

| 属性                   | 说明                             | 类型               | 默认值   |
| ---------------------- | -------------------------------- | ------------------ | -------- |
| `model-value`          | 是否显示                         | `boolean`          | `false`  |
| `title`                | 标题                             | `string`           | `''`     |
| `width`                | 宽度                             | `string \| number` | `480`    |
| `top`                  | 距顶部距离                       | `string \| number` | `'15vh'` |
| `show-close`           | 是否显示关闭按钮                 | `boolean`          | `true`   |
| `close-on-click-modal` | 点击遮罩是否关闭                 | `boolean`          | `true`   |
| `close-on-esc`         | 按 Esc 是否关闭                  | `boolean`          | `true`   |
| `lock-scroll`          | 打开时是否锁定页面滚动           | `boolean`          | `true`   |
| `destroy-on-close`     | 关闭后是否销毁内容               | `boolean`          | `false`  |
| `overlay-class`        | 遮罩层额外类名                   | `string`           | `''`     |
| `panel-class`          | 面板额外类名，用于多实例主题隔离 | `string`           | `''`     |

### Events

| 事件名              | 说明           | 回调参数         |
| ------------------- | -------------- | ---------------- |
| `update:modelValue` | 请求关闭时触发 | `(value: false)` |
| `open`              | 开始打开       | —                |
| `opened`            | 打开动画结束   | —                |
| `close`             | 请求关闭       | —                |
| `closed`            | 关闭动画结束   | —                |

### Slots

| 插槽名    | 说明       |
| --------- | ---------- |
| `default` | 对话框正文 |
| `header`  | 自定义头部 |
| `footer`  | 底部操作区 |

## 行为说明

- 内容 Teleport 到 `body`，通过 z-index 管理器保证层级正确。
- 打开时记录当前焦点并把焦点移入对话框，关闭后还原。
- 多个 Dialog 同时存在时，仅最上层响应 Esc。
- 打开期间锁定 `body` 滚动，关闭动画结束后解锁。
