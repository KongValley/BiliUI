---
title: Watermark 水印
---

# Watermark 水印

在容器上层绘制重复的文字或图片水印，不阻塞交互，适合后台详情页、报表与敏感信息展示。

<script setup>
import DemoBasic from '../examples/watermark/basic.vue'
import basicCode from '../examples/watermark/basic.vue?raw'
import DemoImage from '../examples/watermark/image.vue'
import imageCode from '../examples/watermark/image.vue?raw'
</script>

## 文字水印

`content` 支持字符串或字符串数组（多行），`font` 控制颜色、字号与字重，`gap` 控制重复间距。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 图片水印

传入 `image` 后优先绘制图片水印，`width` / `height` 同时控制单个水印单元的尺寸。

<DemoBlock :code="imageCode">
  <DemoImage />
</DemoBlock>

## API

### Props

| 属性            | 说明                      | 类型                         | 默认值       |
| --------------- | ------------------------- | ---------------------------- | ------------ |
| `content`       | 水印文字，数组表示多行    | `string \| string[]`         | `''`         |
| `image`         | 图片水印地址，优先于文字  | `string`                     | `''`         |
| `image-opacity` | 图片水印透明度            | `number`                     | `0.3`        |
| `font`          | 文字样式                  | `WatermarkFont`              | 见下表       |
| `width`         | 单个水印单元宽度          | `number`                     | `120`        |
| `height`        | 单个水印单元高度          | `number`                     | `64`         |
| `rotate`        | 旋转角度                  | `number`                     | `-22`        |
| `gap`           | 水印间距，数字或 `[x, y]` | `number \| [number, number]` | `[100, 100]` |
| `offset`        | 背景偏移                  | `number \| [number, number]` | `[0, 0]`     |
| `z-index`       | 水印层级                  | `number`                     | `9`          |

### WatermarkFont

| 字段         | 说明     | 默认值                |
| ------------ | -------- | --------------------- |
| `color`      | 文字颜色 | `rgba(0, 0, 0, 0.15)` |
| `fontSize`   | 字号     | `16`                  |
| `fontFamily` | 字体     | `sans-serif`          |
| `fontWeight` | 字重     | `normal`              |
| `fontStyle`  | 字体样式 | `normal`              |

### Slots

| 插槽名    | 说明                 |
| --------- | -------------------- |
| `default` | 被水印覆盖的容器内容 |

### Exposes

| 方法       | 说明             |
| ---------- | ---------------- |
| `update()` | 重新生成水印纹理 |

## 说明

- 水印通过 Canvas 生成 PNG 纹理，再以 `background-repeat` 平铺；按 `devicePixelRatio` 放大绘制，保证高分屏清晰。
- 水印层使用 `pointer-events: none`，不会影响容器内按钮、链接等交互。
- 图片水印会以 `crossOrigin="anonymous"` 加载，跨域图片需要服务端允许 CORS，否则会回退为无纹理。
- 容器需要有实际尺寸；通常配合有背景色的卡片或 `height` 使用。
