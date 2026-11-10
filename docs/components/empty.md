---
title: Empty 空状态
---

# Empty 空状态

数据为空、搜索无结果或加载失败时展示的占位状态，内置多种插画预设。

<script setup>
import DemoBasic from '../examples/empty/basic.vue'
import basicCode from '../examples/empty/basic.vue?raw'
</script>

## 基础用法

`preset` 切换插画，`description` 设置文案，默认插槽放操作按钮。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `preset` | 插画预设 | `'default' \| 'simple' \| 'search' \| 'data'` | `'default'` |
| `description` | 描述文字 | `string` | `'暂无数据'` |
| `small` | 紧凑尺寸 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 底部操作区 |
| `image` | 自定义插画，替换内置 SVG |
| `description` | 自定义描述内容 |

## 说明

- 内置插画为内联 SVG，使用 `currentColor`，会跟随主题色与暗色模式自动适配。
- 插画线条使用 `vector-effect: non-scaling-stroke`，缩放时线宽保持一致。
- `small` 会同时缩小插画与文字，适合表格、下拉面板等紧凑区域。
- 容器带 `role="status"`，屏幕阅读器可感知空状态变化。
