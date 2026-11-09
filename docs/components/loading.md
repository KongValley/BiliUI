---
title: Loading 加载
---

# Loading 加载

提供内联加载组件与 `v-loading` 指令，支持局部遮罩与全屏遮罩。

<script setup>
import DemoBasic from '../examples/loading/basic.vue'
import basicCode from '../examples/loading/basic.vue?raw'
import DemoDirective from '../examples/loading/directive.vue'
import directiveCode from '../examples/loading/directive.vue?raw'
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

## 说明

- 指令使用 `WeakMap` 保存每个元素的加载实例，重复更新不会产生多余遮罩。
- 全屏 Loading 会 Teleport 到 `body`，层级高于对话框与消息提示。
- 遮罩颜色在暗色模式下自动切换。
