---
title: BackTop 回到顶部
---

# BackTop 回到顶部

滚动超过阈值后出现的悬浮按钮，点击平滑回到顶部；支持指定滚动容器、自定义位置与插槽内容。

<script setup>
import DemoBasic from '../examples/back-top/basic.vue'
import basicCode from '../examples/back-top/basic.vue?raw'
import DemoCustom from '../examples/back-top/custom.vue'
import customCode from '../examples/back-top/custom.vue?raw'
</script>

## 基础用法

`target` 指定滚动容器（省略时监听窗口），`visibility-height` 控制出现阈值。按钮默认固定在视口右下角。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 自定义内容与时长

默认插槽可以替换按钮内容；`duration` 控制回顶动画时长，`right` / `bottom` 调整悬浮位置。

<DemoBlock :code="customCode">
  <DemoCustom />
</DemoBlock>

## API

### Props

| 属性                | 说明                                   | 类型                    | 默认值 |
| ------------------- | -------------------------------------- | ----------------------- | ------ |
| `target`            | 滚动容器元素或选择器，省略时使用窗口   | `string \| HTMLElement` | —      |
| `visibility-height` | 滚动多少距离后显示                     | `number`                | `200`  |
| `right`             | 距视口右侧距离                         | `string \| number`      | `40`   |
| `bottom`            | 距视口底部距离                         | `string \| number`      | `40`   |
| `duration`          | 回顶动画时长（毫秒），`0` 表示立即跳转 | `number`                | `450`  |
| `z-index`           | 悬浮层级                               | `number`                | `100`  |

### Events

| 事件名  | 说明     | 回调参数              |
| ------- | -------- | --------------------- |
| `click` | 点击按钮 | `(event: MouseEvent)` |

### Slots

| 插槽名    | 说明                           |
| --------- | ------------------------------ |
| `default` | 按钮内容，默认使用向上箭头图标 |

### Exposes

| 方法 / 属性     | 说明         |
| --------------- | ------------ |
| `scrollToTop()` | 滚动到顶部   |
| `visible`       | 当前是否显示 |

## 说明

- 回顶动画使用 `requestAnimationFrame` 缓动，并带有 watchdog 兜底，隐藏标签页或 rAF 被暂停时也能完成定位。
- 切换 `target` 会自动解绑旧容器的监听并绑定新容器。
- 组件同时监听窗口滚动与目标容器滚动，适合整页与局部滚动两种场景。
