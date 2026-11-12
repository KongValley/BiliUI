---
title: App 应用容器
---

# App 应用容器

为业务子树提供与当前 `ConfigProvider` 绑定的消息、通知和确认框服务，避免全局服务在多主题、多语言场景下互相影响。

<script setup>
import DemoBasic from '../examples/app/basic.vue'
import basicCode from '../examples/app/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

`App` 本身只渲染一个包裹元素；通过 `ref` 或 `useApp()` 拿到的服务会继承最近的 `ConfigProvider` 的 `locale`、`namespace` 与 `z-index`。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 在组件中使用

```vue
<script setup lang="ts">
import { useApp } from 'bili-ui'

const { message, notification, messageBox } = useApp()
</script>

<template>
  <BiliButton @click="message.success('已保存')">保存</BiliButton>
</template>
```

`useApp()` 必须在 `BiliApp` 的子树中调用；如果当前组件不在任何 `App` 内，会回退到全局的 `BiliMessage` / `BiliNotification` / `BiliMessageBox`。

## API

<ApiReference name="BiliApp" />

### useApp 返回值

| 字段 | 说明 |
| --- | --- |
| `message` | 与当前 App 绑定的消息服务，支持 `success` / `warning` / `error` / `info` / `closeAll` |
| `notification` | 与当前 App 绑定的通知服务 |
| `messageBox` | 与当前 App 绑定的确认框服务，支持 `alert` / `confirm` / `prompt` / `closeAll` |
| `config` | 当前生效的 `ConfigProvider` 配置（只读） |

## 说明

- `message` 属性可以设置该 App 下所有消息的默认选项，例如 `:message="{ duration: 0 }"`。
- 服务在每次调用时读取配置，因此运行时切换语言或命名空间会立即生效。
- `closeAll()` 只关闭当前 App 创建的消息 / 通知 / 确认框，不会影响其他 App 或全局服务；`App` 卸载时会自动关闭自己创建的服务实例。
- `App` 不创建新的 `ConfigProvider`，只读取父级配置；需要局部覆盖时在 `App` 外层再嵌套一个 `ConfigProvider`。
