---
title: QRCode 二维码
---

# QRCode 二维码

将文本或链接编码为 SVG 二维码，支持尺寸、颜色、容错级别、静区与中心图标。

<script setup>
import DemoBasic from '../examples/qrcode/basic.vue'
import basicCode from '../examples/qrcode/basic.vue?raw'
import DemoIcon from '../examples/qrcode/icon.vue'
import iconCode from '../examples/qrcode/icon.vue?raw'
</script>

## 基础用法

`value` 为要编码的内容，`size` 同时控制宽高；模块颜色通过 `color`，背景通过 `background` 设置。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 中心图标

传入 `icon` 后会在二维码中心绘制图标，并在图标下方垫一层背景色，避免遮挡关键模块。

<DemoBlock :code="iconCode">
  <DemoIcon />
</DemoBlock>

## API

### Props

| 属性          | 说明                 | 类型                       | 默认值      |
| ------------- | -------------------- | -------------------------- | ----------- |
| `value`       | 要编码的文本或链接   | `string`                   | `''`        |
| `size`        | 二维码尺寸（像素）   | `number`                   | `160`       |
| `color`       | 模块颜色             | `string`                   | `'#1f2329'` |
| `background`  | 背景颜色             | `string`                   | `'#ffffff'` |
| `error-level` | 容错级别             | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'`       |
| `margin`      | 静区宽度（模块数）   | `number`                   | `2`         |
| `icon`        | 中心图标地址         | `string`                   | `''`        |
| `icon-size`   | 中心图标尺寸（像素） | `number`                   | `40`        |
| `aria-label`  | 无障碍标签           | `string`                   | `'二维码'`  |

### Events

| 事件名  | 说明               | 回调参数         |
| ------- | ------------------ | ---------------- |
| `error` | 内容过长或编码失败 | `(error: Error)` |

## 说明

- 使用轻量的 `qrcode-generator` 编码，自动选择版本；输出为单条 SVG `path`，无 Canvas 依赖，可无损缩放。
- `error-level` 越高，可恢复的遮挡越多，但同样内容需要更大的二维码；内容过长时会触发 `error` 并显示失效占位。
- 静区 `margin` 建议保留至少 2 个模块；生成结果已通过 OpenCV 解码校验。
- 内容为空时显示占位文案，可通过 ConfigProvider 的 `locale.empty` / `locale.invalid` 自定义。
