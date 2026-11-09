---
title: Icon 图标
---

# Icon 图标

Bili UI 内置一组 24×24 线性图标，通过 `name` 渲染，颜色继承 `currentColor`，尺寸默认 `1em`。同时支持运行时注册自定义图标与直接内联图标数据。

<script setup>
import DemoBasic from '../examples/icon/basic.vue'
import basicCode from '../examples/icon/basic.vue?raw'
import DemoUsage from '../examples/icon/usage.vue'
import usageCode from '../examples/icon/usage.vue?raw'
import DemoCustom from '../examples/icon/custom.vue'
import customCode from '../examples/icon/custom.vue?raw'
</script>

## 图标集合

当前版本内置 **131 个图标**，分为 11 个类别。图标墙按 `iconGroups` 自动生成，悬停可查看对应的使用写法：

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 尺寸与颜色

`size` 支持数字（按 px）或 CSS 长度字符串；`color` 可传入任意颜色值；`spin` 用于加载态旋转。

<DemoBlock :code="usageCode">
  <DemoUsage />
</DemoBlock>

## 自定义图标

共有三种方式，按使用场景选择：

### 1. 运行时注册（推荐）

适合全项目复用的业务图标，注册一次即可在任何地方用 `name` 引用：

```ts
import { addIcons } from 'bili-ui'

addIcons({
  // 描边图标：数组即 path 的 d 值列表
  rocket: ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2z', 'M12 15l-3-3z'],

  // 填充图标：品牌 logo 这类实心图形
  'brand-mark': {
    mode: 'fill',
    paths: ['M12 2 3 7v10l9 5 9-5V7l-9-5Z']
  },

  // 非 path 图形：用 content 传原始 SVG 片段
  'brand-dot': {
    content: '<circle cx="12" cy="12" r="9" />'
  }
})
```

```vue
<BiliIcon name="rocket" />
<BiliIcon name="brand-mark" color="#e0356b" />
```

注册的图标可覆盖同名内置图标；用 `removeIcon(name)` 可注销。

### 2. 直接传入图标数据

适合只在单处使用的临时图标，无需注册：

```vue
<!-- 数组形式：等同于注册商标的 paths -->
<BiliIcon :icon="['M12 2 2 22h20z']" />

<!-- 对象形式：可指定 mode / viewBox / strokeWidth -->
<BiliIcon
  :icon="{ paths: ['M12 3l2.7 5.9 6.3.8z'], mode: 'fill' }"
  size="28"
/>

<!-- 非 24×24 坐标系 -->
<BiliIcon :icon="['M0 0h32v32H0z']" view-box="0 0 32 32" />
```

### 3. 完全自定义内容

需要多色、渐变或复杂结构时，直接把自己的 SVG 放进 `BiliIcon` 的默认插槽之外的容器，或直接使用原生 `<svg>`，用 `color` 无法覆盖多色图形。

<DemoBlock :code="customCode">
  <DemoCustom />
</DemoBlock>

## 图标是怎么画的

**是的，所有内置图标都是用 SVG 绘制的**，具体实现为：

- 每个图标编译为一个内联 `<svg>` 元素，**没有任何字体图标或外链图片**
- 131 个图标全部只用 `<path>` 元素表达，`d` 值以 `string[]` 形式存放在 `src/components/icon/src/icons.ts` 中
- 统一 `viewBox="0 0 24 24"`、`fill="none"`、`stroke="currentColor"`、`stroke-width="2"`，即**线性描边风格**
- 颜色由 `currentColor` 继承，因此 `color` 属性和父级文字颜色都能直接生效，切换明暗主题无需额外处理
- 尺寸用 `font-size` + `width/height: 1em` 控制，所以图标能与文字自然对齐

这也意味着内置图标**不能**直接改线宽以外的形态细节（如圆角、端点），需要自定义图标时请参考上文方式 1 或 2 提供自己的 path。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `name` | 内置或已注册图标名 | `string` | — |
| `icon` | 内联图标数据，优先级高于 `name` | `string[] \| IconDefinition` | — |
| `size` | 图标尺寸，数字按 px 处理 | `string \| number` | `1em` |
| `color` | 图标颜色 | `string` | 继承 `currentColor` |
| `spin` | 是否旋转 | `boolean` | `false` |
| `mode` | 覆盖绘制模式 | `'stroke' \| 'fill'` | 取自 icon 定义 |
| `viewBox` | 覆盖坐标系 | `string` | `'0 0 24 24'` |
| `strokeWidth` | 覆盖线宽（仅 stroke 模式） | `number` | `2` |

### IconDefinition

```ts
interface IconDefinition {
  paths?: string[]        // path 的 d 值列表
  content?: string        // 原始 SVG 片段，用于 circle / rect 等
  viewBox?: string        // 默认 '0 0 24 24'
  mode?: 'stroke' | 'fill' // 默认 'stroke'
  strokeWidth?: number    // 默认 2
}

type IconSource = string[] | IconDefinition
```

### 方法

| 方法 | 说明 |
| --- | --- |
| `addIcons(record)` | 批量注册自定义图标 |
| `removeIcon(name)` | 注销自定义图标（不影响内置图标） |
| `getIcon(name)` | 按名称解析图标定义，自定义优先于内置 |
| `getIconNames()` | 返回全部可用图标名（含自定义） |
| `getIconGroups()` | 返回按类别组织的内置图标名，用于图标墙与选择器 |

### 导出

```ts
import {
  iconNames,
  iconGroups,
  icons,
  addIcons,
  removeIcon,
  getIcon,
  getIconNames,
  getIconGroups
} from 'bili-ui'

iconNames                // ['arrow-left', 'arrow-right', ...] 全部内置图标名
iconGroups['方向导航']    // ['arrow-left', 'arrow-right', ...] 按类别分组
icons['check']           // ['M20 6 9 17l-5-5'] 内置图标的 path 数组
```

### 分类一览

| 类别 | 数量 | 代表图标 |
| --- | --- | --- |
| 方向导航 | 21 | `arrow-*`、`chevron-*`、`corner-*`、`move`、`maximize` |
| 操作 | 26 | `plus`、`edit`、`delete`、`copy`、`download`、`filter`、`settings` |
| 状态 | 13 | `success`、`warning`、`error`、`info`、`ban`、`shield-check` |
| 媒体 | 11 | `play`、`pause`、`volume`、`image`、`video`、`camera`、`mic` |
| 文件数据 | 10 | `file`、`folder`、`database`、`table`、`chart`、`archive` |
| 通信 | 9 | `mail`、`phone`、`message-*`、`bell`、`send`、`inbox` |
| 用户 | 5 | `user`、`users`、`user-plus`、`smile` |
| 时间 | 4 | `calendar`、`clock`、`history`、`timer` |
| 界面 | 19 | `home`、`menu`、`grid`、`star`、`heart`、`eye`、`lock`、`layout` |
| 开发 | 13 | `code`、`terminal`、`git-branch`、`bug`、`cpu`、`server`、`cloud` |

## 使用建议

- 图标按钮请配合 `aria-label` 提供可访问名称。
- 图标默认垂直对齐基线，可与文字直接混排。
- 传入自定义图标时，建议保持 24×24 坐标系并沿用 `currentColor`，这样能自动适配亮暗主题。
- `content` 接收的原始 SVG 片段会按 `v-html` 渲染，请勿传入来自用户或远端接口的未净化内容。
