---
title: Loading 加载
---

# Loading 加载

提供内联加载组件、`v-loading` 指令与 `BiliLoading.service()` 命令式全屏遮罩。

<script setup>
import DemoBasic from '../examples/loading/basic.vue'
import basicCode from '../examples/loading/basic.vue?raw'
import DemoDirective from '../examples/loading/directive.vue'
import directiveCode from '../examples/loading/directive.vue?raw'
import DemoService from '../examples/loading/service.vue'
import serviceCode from '../examples/loading/service.vue?raw'
</script>

## 内联加载

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 指令与全屏

`v-loading` 会在目标元素内插入遮罩；目标元素若为 `static` 定位，会自动设置 `relative`，卸载时还原。

<DemoBlock :code="directiveCode">
  <DemoDirective />
</DemoBlock>

## 命令式全屏

`BiliLoading.service()` 返回 `{ close, setText, visible }`，适合在请求开始 / 结束时手动控制；不传 `target` 时自动锁定页面滚动。

<DemoBlock :code="serviceCode">
  <DemoService />
</DemoBlock>

```ts
import { BiliLoading } from 'bili-ui'

const loading = BiliLoading.service({ text: '保存中…' })
loading.setText('即将完成…')
loading.close()
```

## API

### Loading Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `text` | 加载文案 | `string` | `''` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `fullscreen` | 是否全屏遮罩 | `boolean` | `false` |

### 指令

| 绑定值 | 说明 |
| --- | --- |
| `true` / `false` | 显示或隐藏默认加载遮罩 |
| `{ text, size }` | 自定义加载文案与尺寸 |

```vue
<div v-loading="loading">内容</div>
<div v-loading="{ text: '同步中...', size: 'sm' }">内容</div>
```

### BiliLoading.service

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `text` | 加载文案 | `string` | `''` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `target` | 挂载目标，支持元素或选择器；不传时为全屏 | `string \| HTMLElement` | — |
| `fullscreen` | 是否使用全屏遮罩 | `boolean` | 无 `target` 时为 `true` |
| `lock` | 全屏时锁定页面滚动 | `boolean` | `true` |
| `background` | 自定义遮罩背景 | `string` | 主题默认 |
| `customClass` | 遮罩附加类名 | `string` | `''` |

### 实例方法

| 方法 | 说明 |
| --- | --- |
| `close()` | 关闭遮罩并恢复滚动 / 定位 |
| `setText(text)` | 更新加载文案 |
| `visible` | 当前是否可见（只读） |

## 说明

- 指令使用 `WeakMap` 保存每个元素的加载实例，重复更新不会产生多余遮罩。
- `service()` 支持多个遮罩同时存在，滚动锁按引用计数恢复，不会互相覆盖。
- 全屏 Loading 会 Teleport 到 `body`，层级高于对话框与消息提示。
- 遮罩颜色在暗色模式下自动切换。
