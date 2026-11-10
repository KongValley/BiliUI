---
title: Notification 通知
---

# Notification 通知

从屏幕角落滑出的通知卡片，适合需要标题与正文的系统提醒。

<script setup>
import DemoBasic from '../examples/notification/basic.vue'
import basicCode from '../examples/notification/basic.vue?raw'
</script>

## 基础用法

通过 `BiliNotification` 命令式调用，或直接使用 `<BiliNotification>` 组件。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### 命令式

```ts
import { BiliNotification } from 'bili-ui'

BiliNotification.success({ title: '同步完成', message: '已同步 128 条记录' })
BiliNotification.warning({ message: '磁盘使用率 92%', position: 'bottom-right' })
BiliNotification.closeAll()
```

快捷方法：`success` / `warning` / `error` / `info`，返回 `{ close }` 实例。

### Options

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `string` | `''` |
| `message` | 正文 | `string` | — |
| `type` | 类型 | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `duration` | 自动关闭毫秒数，`0` 表示不自动关闭 | `number` | `4500` |
| `position` | 出现位置 | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `showClose` | 是否显示关闭按钮 | `boolean` | `true` |
| `showProgress` | 是否显示倒计时进度条 | `boolean` | `true` |
| `onClose` | 关闭回调 | `() => void` | — |

### 组件 Props

与 Options 一致（不含 `position`，组件为内联使用）。

### Events

`close`（开始关闭）、`destroy`（离场动画结束）。

## 说明

- 悬停时会暂停倒计时，进度条同步暂停，移出后继续。
- 同一角落最多保留 6 条，超出时最早的一条自动关闭。
- 每个角落使用独立容器并挂到 body，层级由 `--bili-z-index-message` 统一控制。
- 全局注册后可通过 `app.config.globalProperties.$notification` 访问。
