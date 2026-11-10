---
title: Carousel 走马灯
---

# Carousel 走马灯

在有限空间内轮播展示多张内容，支持自动播放、循环、横向/纵向切换、点击或悬停指示器、箭头常驻与外置指示器。

<script setup>
import DemoBasic from '../examples/carousel/basic.vue'
import basicCode from '../examples/carousel/basic.vue?raw'
import DemoVertical from '../examples/carousel/vertical.vue'
import verticalCode from '../examples/carousel/vertical.vue?raw'
</script>

## 基础用法

`BiliCarousel` 包裹若干 `BiliCarouselItem`，默认自动播放、循环切换，悬停时暂停。`height` 固定轮播高度；省略时高度跟随当前激活项。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 纵向与常驻箭头

`direction="vertical"` 切换为纵向轮播，`arrow="always"` 让箭头常驻，`indicator-position="outside"` 把指示器移到容器下方。

<DemoBlock :code="verticalCode">
  <DemoVertical />
</DemoBlock>

## Carousel API

### Props

| 属性                 | 说明                       | 类型                              | 默认值         |
| -------------------- | -------------------------- | --------------------------------- | -------------- |
| `height`             | 轮播高度，省略时跟随激活项 | `string`                          | —              |
| `initial-index`      | 初始激活索引               | `number`                          | `0`            |
| `trigger`            | 指示器触发方式             | `'click' \| 'hover'`              | `'click'`      |
| `autoplay`           | 是否自动播放               | `boolean`                         | `true`         |
| `interval`           | 自动播放间隔（毫秒）       | `number`                          | `3000`         |
| `indicator-position` | 指示器位置                 | `'inside' \| 'outside' \| 'none'` | `'inside'`     |
| `arrow`              | 箭头显示时机               | `'always' \| 'hover' \| 'never'`  | `'hover'`      |
| `loop`               | 是否循环切换               | `boolean`                         | `true`         |
| `direction`          | 轮播方向                   | `'horizontal' \| 'vertical'`      | `'horizontal'` |
| `pause-on-hover`     | 悬停时暂停自动播放         | `boolean`                         | `true`         |

### Events

| 事件名   | 说明       | 回调参数                          |
| -------- | ---------- | --------------------------------- |
| `change` | 激活项变化 | `(current: number, prev: number)` |

### Exposes

| 方法 / 属性            | 说明                          |
| ---------------------- | ----------------------------- |
| `setActiveItem(index)` | 切换到指定索引，索引从 0 开始 |
| `prev()` / `next()`    | 上一张 / 下一张               |
| `activeIndex`          | 当前激活索引                  |

## CarouselItem API

### Slots

| 插槽名    | 说明       |
| --------- | ---------- |
| `default` | 轮播项内容 |

## 说明

- 轮播项左右/上下位移 100% 并配合透明度过渡；挂载完成前禁用过渡，避免首帧闪动。
- `loop` 关闭后，首尾继续点击箭头不会越界；自动播放到末项后停止。
- 根节点可通过键盘 `←` / `→`（纵向为 `↑` / `↓`）切换，`Home` / `End` 跳到首尾。
- 未设置 `height` 时，激活项使用相对定位撑开容器高度，其余项绝对定位叠放。
