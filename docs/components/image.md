---
title: Image 图片
---

# Image 图片

图片展示组件，支持填充模式、加载占位、加载失败回退，以及带缩放、旋转与切图能力的预览弹层。

<script setup>
import DemoBasic from '../examples/image/basic.vue'
import basicCode from '../examples/image/basic.vue?raw'
import DemoPreview from '../examples/image/preview.vue'
import previewCode from '../examples/image/preview.vue?raw'
import DemoFit from '../examples/image/fit.vue'
import fitCode from '../examples/image/fit.vue?raw'
</script>

## 基础用法

设置 `src` 渲染图片；传入 `preview-src-list` 后悬停显示「预览」遮罩，点击打开预览弹层。预览层支持滚轮/按钮缩放、旋转、拖拽平移，以及键盘 `Esc` / `←` / `→` / `+` / `-` / `0` 快捷操作。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 多图预览

每个 `BiliImage` 都可以通过 `initial-index` 指定打开预览时的初始图片；同一组 `preview-src-list` 让多张缩略图共享一次浏览会话。

<DemoBlock :code="previewCode">
  <DemoPreview />
</DemoBlock>

## 填充模式

`fit` 映射到 CSS `object-fit`，常用 `cover` 裁剪填满、`contain` 完整显示、`fill` 拉伸填满。

<DemoBlock :code="fitCode">
  <DemoFit />
</DemoBlock>

## Image API

### Props

| 属性                    | 说明                         | 类型                                                       | 默认值   |
| ----------------------- | ---------------------------- | ---------------------------------------------------------- | -------- |
| `src`                   | 图片地址                     | `string`                                                   | `''`     |
| `alt`                   | 替代文本                     | `string`                                                   | `''`     |
| `fit`                   | 填充模式                     | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'fill'` |
| `width`                 | 宽度                         | `string \| number`                                         | —        |
| `height`                | 高度                         | `string \| number`                                         | —        |
| `preview-src-list`      | 预览图片列表，非空时开启预览 | `string[]`                                                 | `[]`     |
| `initial-index`         | 预览初始索引                 | `number`                                                   | `0`      |
| `preview-teleported`    | 预览层是否挂载到 `body`      | `boolean`                                                  | `true`   |
| `hide-on-click-modal`   | 点击遮罩是否关闭预览         | `boolean`                                                  | `false`  |
| `close-on-press-escape` | 是否允许 `Esc` 关闭预览      | `boolean`                                                  | `true`   |
| `lazy`                  | 使用浏览器原生懒加载         | `boolean`                                                  | `false`  |
| `min-scale`             | 预览最小缩放比               | `number`                                                   | `0.25`   |
| `max-scale`             | 预览最大缩放比               | `number`                                                   | `4`      |
| `zoom-rate`             | 每次缩放的倍率               | `number`                                                   | `1.25`   |
| `z-index`               | 预览层级，省略时自动递增     | `number`                                                   | —        |

### Events

| 事件名   | 说明         | 回调参数          |
| -------- | ------------ | ----------------- |
| `load`   | 图片加载成功 | `(event: Event)`  |
| `error`  | 图片加载失败 | `(event: Event)`  |
| `show`   | 预览层打开   | —                 |
| `close`  | 预览层关闭   | —                 |
| `switch` | 预览切换图片 | `(index: number)` |

### Slots

| 插槽名        | 说明                                     |
| ------------- | ---------------------------------------- |
| `placeholder` | 加载中的占位内容，默认显示图片图标       |
| `error`       | 加载失败的内容，默认显示「图片加载失败」 |

### Exposes

| 方法                  | 说明                     |
| --------------------- | ------------------------ |
| `showPreview(index?)` | 打开预览，可指定初始索引 |
| `closePreview()`      | 关闭预览                 |

## 说明

- 预览层默认 Teleport 到 `body`，会自动锁定页面滚动并限制焦点在弹层内。
- 缩放范围由 `min-scale` / `max-scale` 控制，双击图片在 `1x` 与 `2x` 之间切换。
- 拖动图片时禁用过渡动画，松开后恢复；缩放回 `1x` 时会自动复位位移。
- 同一时间只响应最上层预览层的 `Esc`，与 Dialog / Drawer 的层级行为一致。
