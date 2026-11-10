---
title: Menu 导航菜单
---

# Menu 导航菜单

页面级导航组件，支持**横向**与**竖向**两种布局。横向模式下超出容器的项自动收进「更多」下拉，竖向模式下可折叠为只显示图标的窄栏，两种模式都支持二级菜单。

<script setup>
import DemoHorizontal from '../examples/menu/horizontal.vue'
import horizontalCode from '../examples/menu/horizontal.vue?raw'
import DemoSubmenu from '../examples/menu/submenu.vue'
import submenuCode from '../examples/menu/submenu.vue?raw'
import DemoOverflow from '../examples/menu/overflow.vue'
import overflowCode from '../examples/menu/overflow.vue?raw'
import DemoVertical from '../examples/menu/vertical.vue'
import verticalCode from '../examples/menu/vertical.vue?raw'
</script>

## 横向菜单

通过 `items` 传入数据，`v-model` 绑定选中项的 `key`。

<DemoBlock :code="horizontalCode">
  <DemoHorizontal />
</DemoBlock>

## 横向二级菜单

父项带 `children` 时自动渲染为二级菜单，默认悬停展开，可用 `trigger="click"` 改为点击展开。

<DemoBlock :code="submenuCode">
  <DemoSubmenu />
</DemoBlock>

## 横向溢出收纳

横向模式默认开启 `overflow`：宽度不足时，末尾放不下的项自动移入右侧「更多」下拉。拖动下方面板的右下角可调整宽度观察效果。

<DemoBlock :code="overflowCode">
  <DemoOverflow />
</DemoBlock>

## 竖向折叠

`mode="vertical"` + `collapsed` 折叠为图标窄栏（默认 64px），此时二级菜单改为悬停浮层展开；折叠状态下列表项显示 `title` 提示。

<DemoBlock :code="verticalCode">
  <DemoVertical />
</DemoBlock>

## 插槽写法

除 `items` 外，也可以用子组件声明菜单，适合内容需要高度定制的场景：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const active = ref('home')
</script>

<template>
  <BiliMenu v-model="active" mode="vertical">
    <BiliMenuItem item-key="home" label="概览" icon="home" />
    <BiliSubMenu sub-key="project" title="项目管理" icon="grid">
      <BiliMenuItem item-key="p1" label="全部项目" />
      <BiliMenuItem item-key="p2" label="我的项目" disabled />
    </BiliSubMenu>
    <BiliMenuItem item-key="settings" label="设置" icon="settings" />
  </BiliMenu>
</template>
```

## Menu API

### Props

| 属性                  | 说明                             | 类型                         | 默认值         |
| --------------------- | -------------------------------- | ---------------------------- | -------------- |
| `mode`                | 布局方向                         | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `items`               | 数据驱动菜单项                   | `MenuItem[]`                 | `[]`           |
| `v-model`             | 当前选中项的 key                 | `string`                     | —              |
| `default-opened-keys` | 初始展开的二级菜单 key           | `string[]`                   | `[]`           |
| `collapsed`           | 是否折叠为图标窄栏（仅竖向生效） | `boolean`                    | `false`        |
| `collapsed-width`     | 折叠后的宽度                     | `string \| number`           | `64`           |
| `overflow`            | 横向是否启用溢出收纳             | `boolean`                    | `true`         |
| `trigger`             | 二级菜单展开方式                 | `'hover' \| 'click'`         | `'hover'`      |
| `ellipsis-text`       | 「更多」按钮文案                 | `string`                     | `'更多'`       |
| `popper-class`        | 浮层额外类名，用于多实例主题隔离 | `string`                     | `''`           |

### Events

| 事件名              | 说明                 | 回调参数                        |
| ------------------- | -------------------- | ------------------------------- |
| `update:modelValue` | 选中项变化           | `(key: string)`                 |
| `select`            | 点击菜单项           | `(key: string, item: MenuItem)` |
| `open-change`       | 二级菜单展开状态变化 | `(keys: string[])`              |

### MenuItem

```ts
interface MenuItem {
  key: string // 唯一标识，选中时作为 modelValue
  label: string // 显示文本
  icon?: string // 图标名，见 Icon 组件
  disabled?: boolean
  children?: MenuItem[] // 有值时渲染为二级菜单
}
```

## MenuItem API

| 属性       | 说明     | 类型      | 默认值  |
| ---------- | -------- | --------- | ------- |
| `item-key` | 唯一标识 | `string`  | 必填    |
| `label`    | 显示文本 | `string`  | `''`    |
| `icon`     | 图标名   | `string`  | `''`    |
| `disabled` | 是否禁用 | `boolean` | `false` |

## SubMenu API

| 属性       | 说明     | 类型      | 默认值  |
| ---------- | -------- | --------- | ------- |
| `sub-key`  | 唯一标识 | `string`  | 必填    |
| `title`    | 父项文本 | `string`  | `''`    |
| `icon`     | 父项图标 | `string`  | `''`    |
| `disabled` | 是否禁用 | `boolean` | `false` |

### Slots

| 插槽名             | 说明           |
| ------------------ | -------------- |
| `title`（SubMenu） | 自定义父项内容 |
| `default`          | 子菜单项       |

## 样式变量

| 变量                       | 说明                  |
| -------------------------- | --------------------- |
| `--bili-menu-item-height`  | 菜单项高度，默认 36px |
| `--bili-menu-item-padding` | 菜单项水平内边距      |
| `--bili-menu-radius`       | 菜单项圆角            |

## 说明

- 收纳行为分两种：**横向放不下 → 溢出项进「更多」下拉**；**竖向折叠 → 变图标窄栏，二级菜单转浮层**。
- 溢出测量基于 `ResizeObserver`，容器或菜单项变化时会自动重新计算。
- 折叠状态下若菜单项没有 `icon`，窄栏只显示文字首字，建议折叠菜单始终配置图标。
- 二级菜单浮层通过 Teleport 挂载到 `body`，层级由 z-index 管理器统一分配。
- `mode="horizontal"` 时设置 `collapsed` 不生效，避免出现横向图标条这种非常规形态。
