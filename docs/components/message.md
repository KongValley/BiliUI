---
title: Message 消息提示
---

# Message 消息提示

以命令式 API 在页面顶部展示轻量反馈，支持自动关闭倒计时进度条、悬停暂停与手动堆叠管理。

<script setup>
import DemoBasic from '../examples/message/basic.vue'
import basicCode from '../examples/message/basic.vue?raw'
import DemoOptions from '../examples/message/options.vue'
import optionsCode from '../examples/message/options.vue?raw'
</script>

## 基础用法

默认 3 秒后自动关闭，底部会显示一条随剩余时间收缩的倒计时进度条，颜色跟随消息类型。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 倒计时与关闭

- 进度条会从右向左收缩，走完即自动关闭，让用户直观感知剩余时间。
- 鼠标移入消息时**倒计时暂停**，进度条同步冻结；移出后按剩余时间继续。
- `duration` 为 0 时消息常驻，此时不渲染进度条。
- `showClose` 显示关闭按钮，`closeAll()` 关闭当前所有消息。

<DemoBlock :code="optionsCode">
  <DemoOptions />
</DemoBlock>

## API

### 调用方式

```ts
import { BiliMessage } from 'bili-ui'

BiliMessage('普通消息')
BiliMessage.success('成功消息')
BiliMessage.warning('警告消息')
BiliMessage.error('错误消息')
BiliMessage.info('信息消息')
BiliMessage.closeAll()
```

全量安装后也可通过 `this.$message` 调用。

### Options

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `message` | 消息文本 | `string` | — |
| `type` | 类型 | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `duration` | 自动关闭时间（毫秒），0 表示不关闭 | `number` | `3000` |
| `showClose` | 是否显示关闭按钮 | `boolean` | `false` |
| `showProgress` | 是否显示倒计时进度条 | `boolean` | `true` |
| `pauseOnHover` | 悬停时是否暂停倒计时 | `boolean` | `true` |
| `onClose` | 关闭回调 | `() => void` | — |

### 返回值

每次调用返回 `{ close: () => void }`，可手动关闭该条消息：

```ts
const instance = BiliMessage.info('处理中...')
setTimeout(() => instance.close(), 1000)
```

## 说明

- 消息容器固定在页面顶部居中，采用纵向堆叠布局。
- 所有消息共用同一个容器，避免重复创建 DOM。
- 进度条使用 `transform: scaleX()` 实现，只影响合成层，不会触发布局回流。
- 开启系统「减少动态效果」时进度条不再渲染，但关闭时间不受影响。
- 关闭动画结束后会卸载组件并清理实例。
