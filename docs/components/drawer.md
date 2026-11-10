---
title: Drawer 抽屉
---

# Drawer 抽屉

从屏幕边缘滑出的浮层面板，适合承载筛选、详情、表单等需要保留页面上下文的场景。支持四个方向、焦点锁定、滚动锁定与 ESC 关闭。

<script setup>
import DemoBasic from '../examples/drawer/basic.vue'
import basicCode from '../examples/drawer/basic.vue?raw'
</script>

## 基础用法

通过 `v-model` 控制显隐，`placement` 指定滑出方向，`size` 在左右方向表示宽度、上下方向表示高度。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性                | 说明                             | 类型                                     | 默认值    |
| ------------------- | -------------------------------- | ---------------------------------------- | --------- |
| `modelValue`        | 是否显示，支持 `v-model`         | `boolean`                                | `false`   |
| `title`             | 标题                             | `string`                                 | `''`      |
| `placement`         | 滑出方向                         | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| `size`              | 左右方向的宽度 / 上下方向的高度  | `string \| number`                       | `360`     |
| `showClose`         | 是否显示关闭按钮                 | `boolean`                                | `true`    |
| `closeOnClickModal` | 点击遮罩是否关闭                 | `boolean`                                | `true`    |
| `closeOnEsc`        | 按 ESC 是否关闭                  | `boolean`                                | `true`    |
| `lockScroll`        | 打开时是否锁定页面滚动           | `boolean`                                | `true`    |
| `destroyOnClose`    | 关闭后是否销毁内容               | `boolean`                                | `false`   |
| `overlayClass`      | 遮罩层额外类名                   | `string`                                 | `''`      |
| `panelClass`        | 面板额外类名，用于多实例主题隔离 | `string`                                 | `''`      |

### Events

| 事件名              | 说明               | 回调参数           |
| ------------------- | ------------------ | ------------------ |
| `update:modelValue` | 显隐状态变化       | `(value: boolean)` |
| `open`              | 开始打开时触发     | —                  |
| `opened`            | 打开动画结束后触发 | —                  |
| `close`             | 开始关闭时触发     | —                  |
| `closed`            | 关闭动画结束后触发 | —                  |

### Slots

| 插槽名    | 说明       |
| --------- | ---------- |
| `default` | 抽屉内容   |
| `header`  | 自定义头部 |
| `footer`  | 底部操作区 |

## 说明

- 抽屉通过 `Teleport` 渲染到 `body`，层级由全局 z-index 管理，可与其他弹层叠放。
- 打开时焦点会移入抽屉并在内部循环，关闭后还原到触发元素；ESC 只关闭最顶层的抽屉或对话框。
- 遮罩使用固定定位并锁定页面滚动，内容超出时仅抽屉主体滚动。
- 尺寸映射：左右抽屉设置 `width`，上下抽屉设置 `height`，均受视口大小限制。
