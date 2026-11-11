---
title: MessageBox 消息确认
---

# MessageBox 消息确认

命令式的确认、提示与输入对话框，适合删除确认、操作二次确认与轻量表单输入。

<script setup>
import DemoBasic from '../examples/message-box/basic.vue'
import basicCode from '../examples/message-box/basic.vue?raw'
</script>

## 基础用法

`alert` 只有一个确认按钮；`confirm` 返回 Promise，确认时 resolve，取消或关闭时 reject；`prompt` 额外返回输入框内容。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 调用方式

```ts
import { BiliMessageBox } from 'bili-ui'

await BiliMessageBox.alert('操作已完成', '提示')

try {
  await BiliMessageBox.confirm('确定删除吗？', '删除确认')
  // 用户点击了确定
} catch (action) {
  // action 为 'cancel' 或 'close'
}

const { value } = await BiliMessageBox.prompt('请输入名称', '新建项目')
```

`BiliDialog` 也暴露同一套方法：`BiliDialog.alert`、`BiliDialog.confirm`、`BiliDialog.prompt`、`BiliDialog.closeAll`。

## 异步确认

`beforeClose(action, instance, done)` 可以拦截关闭流程。调用 `instance.setLoading(true)` 显示确认按钮 loading，处理完成后调用 `done()`，也可以直接返回 Promise。

```ts
BiliMessageBox.confirm('确定发布吗？', '发布', {
  beforeClose: async (action, instance, done) => {
    if (action !== 'confirm') return done()
    instance.setLoading(true)
    await publish()
    done()
  }
})
```

## API

### 方法

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| `alert(message, title?, options?)` | 提示框 | `Promise<{ action, value }>` |
| `confirm(message, title?, options?)` | 确认框 | `Promise<{ action, value }>` |
| `prompt(message, title?, options?)` | 输入框 | `Promise<{ action, value }>` |
| `closeAll()` | 关闭全部 | — |

### Options

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `string` | `''` |
| `message` | 正文 | `string` | `''` |
| `type` | 图标类型 | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `confirmButtonText` / `cancelButtonText` | 按钮文案 | `string` | 国际化「确定 / 取消」 |
| `showCancelButton` | 显示取消按钮 | `boolean` | confirm / prompt 为 `true` |
| `showClose` | 显示关闭按钮 | `boolean` | `true` |
| `closeOnClickModal` | 点击遮罩关闭 | `boolean` | `true` |
| `closeOnPressEscape` | `Esc` 关闭 | `boolean` | `true` |
| `input` | 显示输入框 | `boolean` | prompt 为 `true` |
| `inputValue` | 输入框初始值 | `string` | `''` |
| `inputPlaceholder` | 输入框占位文字 | `string` | 国际化 |
| `inputPattern` | 输入正则校验 | `RegExp` | — |
| `inputValidator` | 自定义校验，返回 `false` 或错误文案 | `(value) => boolean \| string` | — |
| `beforeClose` | 关闭前拦截 | `(action, instance, done) => void \| Promise` | — |
| `overlayClass` / `panelClass` | 遮罩 / 面板额外类名 | `string` | `''` |
| `zIndex` | 层级 | `number` | — |
