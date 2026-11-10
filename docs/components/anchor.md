---
title: Anchor 锚点
---

# Anchor 锚点

长页面/滚动容器内的段落导航，滚动时自动高亮当前章节，点击平滑定位，支持嵌套链接与横向布局。

<script setup>
import DemoBasic from '../examples/anchor/basic.vue'
import basicCode from '../examples/anchor/basic.vue?raw'
import DemoNested from '../examples/anchor/nested.vue'
import nestedCode from '../examples/anchor/nested.vue?raw'
</script>

## 基础用法

通过 `container` 指定滚动容器（元素或选择器，省略时监听窗口），`BiliAnchorLink` 的 `href` 指向目标区块的 `id`。滚动容器时当前章节自动高亮，点击链接平滑滚动。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 嵌套链接

把子链接放入父链接的 `sub-link` 插槽。子链接激活时，父链接会同步高亮，但只有精确命中项显示左侧标识条。

<DemoBlock :code="nestedCode">
  <DemoNested />
</DemoBlock>

## Anchor API

### Props

| 属性        | 说明                                   | 类型                         | 默认值       |
| ----------- | -------------------------------------- | ---------------------------- | ------------ |
| `container` | 滚动容器元素或选择器，省略时使用窗口   | `string \| HTMLElement`      | —            |
| `offset`    | 目标距离容器顶部的偏移                 | `number`                     | `0`          |
| `bound`     | 激活判定的容差范围                     | `number`                     | `15`         |
| `duration`  | 平滑滚动时长（毫秒），`0` 表示立即跳转 | `number`                     | `300`        |
| `marker`    | 是否显示激活标识条                     | `boolean`                    | `true`       |
| `direction` | 排列方向                               | `'vertical' \| 'horizontal'` | `'vertical'` |

### Events

| 事件名   | 说明                   | 回调参数                            |
| -------- | ---------------------- | ----------------------------------- |
| `change` | 激活链接变化           | `(href: string)`                    |
| `click`  | 点击链接（目标存在时） | `(event: MouseEvent, href: string)` |

### Exposes

| 方法             | 说明              |
| ---------------- | ----------------- |
| `scrollTo(href)` | 滚动到指定锚点    |
| `activeHref`     | 当前激活的 `href` |

### Slots

| 插槽名    | 说明         |
| --------- | ------------ |
| `default` | 锚点链接列表 |

## AnchorLink API

### Props

| 属性    | 说明                  | 类型     | 默认值 |
| ------- | --------------------- | -------- | ------ |
| `href`  | 目标区块，如 `#usage` | `string` | —      |
| `title` | 链接文本              | `string` | `''`   |

### Slots

| 插槽名     | 说明                         |
| ---------- | ---------------------------- |
| `default`  | 自定义链接文本，覆盖 `title` |
| `sub-link` | 嵌套的子链接列表             |

## 说明

- 目标区块需真实存在于文档中：`href` 去掉 `#` 后作为 `id` 查找；找不到目标时保留浏览器默认跳转。
- 激活判定按目标区块在文档中的顺序计算，滚到容器底部时强制激活最后一项。
- 滚动监听使用 `passive` 并对更新做 `requestAnimationFrame` 节流；点击触发的平滑滚动期间暂停滚动监听，避免高亮闪烁。
- `offset` 适合为吸顶导航预留高度；`bound` 吸收像素级误差，避免临界位置抖动。
