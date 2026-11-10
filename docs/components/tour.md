---
title: Tour 引导
---

# Tour 引导

分步引导用户熟悉页面功能：高亮目标、遮罩其余区域，并通过气泡卡片控制上一步、下一步与完成。

<script setup>
import DemoBasic from '../examples/tour/basic.vue'
import basicCode from '../examples/tour/basic.vue?raw'
</script>

## 基础用法

`steps` 定义每一步的目标、标题与描述，`v-model` 绑定当前步骤索引；索引为 `-1` 时隐藏引导。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性                    | 说明                             | 类型         | 默认值  |
| ----------------------- | -------------------------------- | ------------ | ------- |
| `model-value`           | 当前步骤索引，`-1` 表示关闭      | `number`     | `0`     |
| `steps`                 | 步骤配置                         | `TourStep[]` | `[]`    |
| `mask`                  | 是否显示遮罩                     | `boolean`    | `true`  |
| `mask-padding`          | 遮罩镂空区域相对目标的额外留白   | `number`     | `4`     |
| `show-close`            | 是否显示关闭按钮                 | `boolean`    | `true`  |
| `close-on-press-escape` | 是否允许 `Esc` 关闭              | `boolean`    | `true`  |
| `close-on-mask-click`   | 点击遮罩是否关闭                 | `boolean`    | `false` |
| `scroll-into-view`      | 切换步骤时是否滚动目标到可视区域 | `boolean`    | `true`  |
| `z-index`               | 遮罩与气泡层级                   | `number`     | —       |
| `popper-class`          | 浮层额外类名，用于多实例主题隔离 | `string`     | `''`    |

### TourStep

| 字段          | 说明                                   | 类型                                                                   |
| ------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| `target`      | 高亮目标：选择器、元素或返回元素的函数 | `string \| HTMLElement \| (() => HTMLElement \| null)`                 |
| `title`       | 标题                                   | `string`                                                               |
| `description` | 描述                                   | `string`                                                               |
| `placement`   | 气泡位置                               | `'top' \| 'bottom' \| 'left' \| 'right'` 及带 `-start` / `-end` 的变体 |

### Events

| 事件名              | 说明             | 回调参数          |
| ------------------- | ---------------- | ----------------- |
| `update:modelValue` | 当前步骤变化     | `(index: number)` |
| `change`            | 当前步骤变化     | `(index: number)` |
| `next`              | 前进到下一步     | `(index: number)` |
| `prev`              | 返回到上一步     | `(index: number)` |
| `finish`            | 最后一步点击完成 | `(index: number)` |
| `close`             | 关闭引导         | `(index: number)` |

### Slots

| 插槽名       | 说明                                                |
| ------------ | --------------------------------------------------- |
| `default`    | 气泡内容，参数 `{ step, index, next, prev, close }` |
| `header`     | 自定义标题，参数 `{ step, index }`                  |
| `indicators` | 自定义步骤指示器，参数 `{ steps, current, goTo }`   |

### Exposes

| 方法 / 属性                     | 说明                   |
| ------------------------------- | ---------------------- |
| `next()` / `prev()` / `close()` | 下一步 / 上一步 / 关闭 |
| `goTo(index)`                   | 跳到指定步骤           |
| `currentIndex`                  | 当前步骤索引           |
| `visible`                       | 是否显示               |

## 说明

- 遮罩由目标四周的四块固定区域组成，目标区域保持可交互；目标不存在时退化为整屏遮罩。
- 气泡通过 `@floating-ui/dom` 自动翻转与偏移，步骤切换后会自动聚焦气泡，支持 `←` / `→` 快捷键。
- 最后一步点击「完成」会依次触发 `finish`、`close`，并将 `v-model` 置为 `-1`。
- 与 Dialog / Drawer 共用遮罩层级栈，`Esc` 只关闭最上层引导。
