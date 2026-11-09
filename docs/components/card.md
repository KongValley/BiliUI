---
title: Card 卡片
---

# Card 卡片

通用容器，用于承载一组相关信息。支持标题、封面、底部操作、加载态与悬停反馈。

<script setup>
import DemoBasic from '../examples/card/basic.vue'
import basicCode from '../examples/card/basic.vue?raw'
import DemoAdvanced from '../examples/card/advanced.vue'
import advancedCode from '../examples/card/advanced.vue?raw'
import DemoSlots from '../examples/card/slots.vue'
import slotsCode from '../examples/card/slots.vue?raw'
</script>

## 基础用法

`title` 渲染头部标题，`extra` 属性或 `extra` 插槽放置右上角附加内容，`footer` 插槽放置底部操作。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 阴影、加载与尺寸

`shadow` 控制阴影出现时机，`hoverable` 增加悬停上浮，`loading` 覆盖加载遮罩，`body-flush` 去掉内边距以便嵌入表格。

<DemoBlock :code="advancedCode">
  <DemoAdvanced />
</DemoBlock>

## 封面与自定义头部

`cover` 插槽渲染在头部之上；`header` / `extra` 插槽可完全自定义头部。

<DemoBlock :code="slotsCode">
  <DemoSlots />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题文本 | `string` | `''` |
| `extra` | 右上角附加文本 | `string` | `''` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `bordered` | 是否显示边框 | `boolean` | `true` |
| `shadow` | 阴影出现时机 | `'always' \| 'hover' \| 'never'` | `'always'` |
| `hoverable` | 是否悬停上浮并加深阴影 | `boolean` | `false` |
| `loading` | 是否显示加载遮罩 | `boolean` | `false` |
| `body-flush` | 是否移除正文内边距 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `click` | 点击卡片时触发 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 卡片正文 |
| `header` | 自定义头部，优先级高于 `title` |
| `extra` | 头部右侧内容，优先级高于 `extra` 属性 |
| `cover` | 封面区域，渲染在头部之上 |
| `footer` | 底部内容 |
| `loading` | 自定义加载提示文案 |

### 样式变量

| 变量 | 说明 |
| --- | --- |
| `--bili-card-padding` | 内边距（随 `size` 变化） |
| `--bili-card-radius` | 圆角 |
| `--bili-card-shadow` | 当前阴影 |
| `--bili-card-loading-bg` | 加载遮罩背景色 |

## 说明

- `hoverable` 会同时加上 `cursor: pointer` 与按下回落效果，适合可点击的卡片。
- `shadow="hover"` 只控制阴影出现时机，不改变光标与位移；需要完整交互反馈请用 `hoverable`。
- `loading` 期间内部内容会禁用指针事件与文本选择，避免误操作。
- 卡片默认 `overflow: hidden`，因此 `cover` 中的图片会自动被圆角裁切。
