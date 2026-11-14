# 主题定制

Bili UI 的样式分为三层令牌：**SCSS 原始值** → **语义 CSS 变量** → **组件变量**。业务侧只需要覆盖第二层（CSS 变量），即可完成换肤；需要微调单个组件时，再覆盖第三层。

## 覆盖品牌色

```css
:root {
  --bili-color-primary: #e0356b;
  --bili-color-primary-hover: #ef5c8c;
  --bili-color-primary-active: #c42759;
  --bili-color-primary-light: #fdeef4;
  --bili-color-on-primary: #ffffff;
}
```

> 建议同时提供 `hover`、`active`、`light` 与 `on-primary` 四个衍生值，否则按钮、标签等组件在交互态下可能出现对比度不足。

## 运行时切换主题色

`setThemeColor` 会写入一份同时包含亮色与暗色派生值的样式，组件、浮层和图表会自动跟随：

```ts
import { setThemeColor, resetThemeColor, themeColorPresets } from 'bili-ui'

setThemeColor('#4f7cff') // 自动派生 hover / active / light / on-primary
resetThemeColor() // 恢复品牌默认色

// 内置预设：[{ name: '招牌粉', color: '#e0356b' }, ...]
console.log(themeColorPresets)
```

- 切换后无需重新挂载组件，CSS 变量会立即生效。
- `html.dark` 会自动使用提亮后的主色与适配暗色背景的浅色变量。
- 同时更新 `--bili-chart-color-1`，折线图、柱状图等默认系列色会跟随主题。
- 文档站导航栏右侧提供调色板入口，可实时预览预设色和自定义颜色。

## 语义令牌

| 变量                      | 用途     | 亮色默认值 |
| ------------------------- | -------- | ---------- |
| `--bili-color-primary`    | 品牌主色 | `#e0356b`  |
| `--bili-color-success`    | 成功     | `#22a06b`  |
| `--bili-color-warning`    | 警告     | `#e6a23c`  |
| `--bili-color-danger`     | 危险     | `#e5484d`  |
| `--bili-color-info`       | 信息     | `#8a919f`  |
| `--bili-text-primary`     | 主要文字 | `#26262b`  |
| `--bili-text-regular`     | 常规文字 | `#55565e`  |
| `--bili-text-secondary`   | 次要文字 | `#878790`  |
| `--bili-text-placeholder` | 占位文字 | `#acacb4`  |
| `--bili-bg-page`          | 页面背景 | `#f8f8f9`  |
| `--bili-bg-container`     | 容器背景 | `#ffffff`  |
| `--bili-bg-elevated`      | 浮层背景 | `#ffffff`  |
| `--bili-border-color`     | 边框     | `#dfdfe3`  |
| `--bili-fill-color`       | 填充     | `#eeeef1`  |

完整令牌定义位于 `src/styles/var.scss`，也可在文档站的设计规范页查看排版、圆角、阴影与间距令牌。

## 暗色主题

所有语义变量在 `html.dark` 下都有对应覆盖：

```css
html.dark {
  --bili-color-primary: #fb7299;
  --bili-color-primary-hover: #ff8fb1;
  --bili-color-primary-active: #e05c85;
  --bili-color-primary-light: #3a1d27;
  --bili-color-on-primary: #2b0a14;
  --bili-bg-page: #0f1115;
  --bili-bg-container: #171a1f;
  --bili-text-primary: #f0f0f2;
}
```

切换方式：

```ts
// 跟随业务主题
document.documentElement.classList.toggle('dark')

// 或使用系统偏好
const media = window.matchMedia('(prefers-color-scheme: dark)')
document.documentElement.classList.toggle('dark', media.matches)
```

## 组件级变量

大多数组件在根节点暴露以 `--bili-<component>-` 开头的变量，可以只改某个组件的局部样式：

```css
/* 只放大大号按钮，不影响其他尺寸 */
.bili-button--lg {
  --bili-button-padding: 22px;
}

/* 调整输入框高度与圆角 */
.bili-input {
  --bili-input-height: 36px;
  --bili-input-radius: 10px;
}
```

常用组件变量：

| 组件   | 变量示例                                                                  |
| ------ | ------------------------------------------------------------------------- |
| Button | `--bili-button-height`、`--bili-button-padding`、`--bili-button-bg`       |
| Input  | `--bili-input-height`、`--bili-input-padding`、`--bili-input-radius`      |
| Select | `--bili-select-height`、`--bili-select-padding`、`--bili-select-panel-bg` |
| Switch | `--bili-switch-width`、`--bili-switch-height`、`--bili-switch-on-bg`      |

完整的组件变量、浮层选择器与内联样式说明见 [样式覆写](/guide/style-overrides)。

> Tooltip、Popover、Select 面板等浮层会 Teleport 到 `body`，变量需要直接写在浮层元素上，例如 `.bili-tooltip__content`、`.bili-select__panel`；多实例主题可用 `popper-class` / `panel-class` 隔离。

## 设计约束

- 尺寸统一为 `sm` / `md` / `lg`，对应控件高度 30 / 36 / 42 px；紧凑控件字号由 `--bili-control-font-size` 单独控制，不与正文混用。
- 文本与背景对比度以 WCAG AA 为基线，暗色模式会将主色提亮。
- 动效时长统一为 `0.18s`，缓动为 `cubic-bezier(0.2, 0, 0, 1)`。
