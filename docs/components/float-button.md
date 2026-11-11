---
title: FloatButton 悬浮按钮
---

# FloatButton 悬浮按钮

固定在视口角落的操作按钮，支持圆形 / 方形、图标 + 描述、链接、回到顶部以及多按钮组合。

<script setup>
import DemoBasic from '../examples/float-button/basic.vue'
import basicCode from '../examples/float-button/basic.vue?raw'
</script>

## 基础用法

`BiliFloatButtonGroup` 负责统一固定位置与间距，内部按钮自动切换为静态布局，并按 `direction` 排列。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 说明

- 单独使用时，`right` / `bottom` 控制按钮距离视口右下角的距离。
- `backTop` 会在点击后平滑滚动到页面顶部，未指定 `icon` 时默认显示向上箭头。
- 传入 `href` 时渲染为 `<a>`，可配合 `target` 打开新窗口。
- 放在 `BiliFloatButtonGroup` 中时，按钮不再各自固定定位，由分组统一控制位置。

## API

### FloatButton Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 按钮类型 | `'default' \| 'primary'` | `'default'` |
| `shape` | 形状 | `'circle' \| 'square'` | `'circle'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg' \| number` | `'md'` |
| `icon` | 内置图标名 | `string` | `''` |
| `description` | 图标右侧文字 | `string` | `''` |
| `href` / `target` | 链接地址与新窗口目标 | `string` | `''` |
| `backTop` | 点击回到顶部 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `right` / `bottom` | 距视口右侧 / 底部距离 | `string \| number` | `24` |
| `zIndex` | 层级 | `number` | `100` |

### FloatButtonGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `direction` | 排列方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| `gap` | 按钮间距 | `string \| number` | `12` |
| `right` / `bottom` | 分组位置 | `string \| number` | `24` |
| `zIndex` | 层级 | `number` | `100` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `click` | 按钮点击 | `(event: MouseEvent)` |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` / `icon` | 图标内容 |
| `description` | 按钮文字 |
