# 快速开始

Bili UI 是一套基于 Vue 3 + TypeScript 的 PC 端组件库，采用 SCSS + BEM + CSS 变量实现主题体系，内置亮暗双主题。

## 安装

```bash
pnpm add bili-ui
# 或 npm install bili-ui
```

本库以 `vue` 作为 peer dependency，请确保项目中使用 Vue 3.4 及以上版本。

## 全量引入

```ts
import { createApp } from 'vue'
import BiliUI from 'bili-ui'
import 'bili-ui/style.css'
import App from './App.vue'

createApp(App).use(BiliUI).mount('#app')
```

全量安装会注册所有组件，并同时注册 `v-loading` 指令与全局 `$message` 方法：

```ts
// 在组件内
this.$message.success('操作成功')
```

## 按需引入

```vue
<script setup lang="ts">
import { BiliButton, BiliInput, BiliMessage } from 'bili-ui'
import 'bili-ui/style.css'
</script>

<template>
  <BiliInput placeholder="请输入关键词" />
  <BiliButton type="primary" @click="BiliMessage.success('已提交')">
    提交
  </BiliButton>
</template>
```

> 需要减小 CSS 体积时，改用按需样式入口，详见[按需样式](/guide/on-demand)。

## 主题与暗色模式

组件样式基于 CSS 变量，可直接在项目入口覆盖：

```css
:root {
  --bili-color-primary: #5b6cff;
  --bili-color-primary-hover: #7d8bff;
  --bili-color-primary-active: #4454e6;
  --bili-color-primary-light: #eef0ff;
}
```

暗色模式通过 `html` 上的 `dark` 类激活：

```ts
document.documentElement.classList.toggle('dark')
```

如果使用 VitePress，主题切换按钮会天然与该机制对齐。

## SSR / Nuxt

组件在 `setup` 阶段不访问 `document` / `window`，可直接用于 SSR。Nuxt 3 中创建一个插件即可：

```ts
// plugins/bili-ui.ts
import BiliUI from 'bili-ui'
import 'bili-ui/style.css'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(BiliUI)
})
```

- Teleport 浮层（Dialog、Drawer、Tooltip 等）在服务端不会渲染内容，客户端挂载后正常显示。
- 需要浏览器尺寸的组件（Chart、VirtualList、Affix 等）在 `onMounted` 后才开始测量。
- 自定义主题色时在插件或客户端入口调用 `setThemeColor`，避免在服务端写入 `<style>`。
- 仓库包含 `vue/server-renderer` 冒烟测试，覆盖表单、表格、日期、浮层与新增组件。

## 浏览器支持

Bili UI 面向现代浏览器构建，目标为支持原生 ES2020、CSS 自定义属性与 Flexbox 的浏览器：

- Chrome / Edge ≥ 90
- Firefox ≥ 90
- Safari ≥ 14

## 本地开发

```bash
pnpm install
pnpm dev        # 启动文档站
pnpm test       # 运行单元测试
pnpm build      # 构建组件库产物
pnpm typecheck  # 类型检查
```

仓库采用 pnpm workspace 组织：

```text
packages/bili-ui  组件库源码与样式
docs              VitePress 文档站
```
