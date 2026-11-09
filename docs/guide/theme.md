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

## 语义令牌

| 变量 | 用途 | 亮色默认值 |
| --- | --- | --- |
| `--bili-color-primary` | 品牌主色 | `#e0356b` |
| `--bili-color-success` | 成功 | `#22a06b` |
| `--bili-color-warning` | 警告 | `#e6a23c` |
| `--bili-color-danger` | 危险 | `#e5484d` |
| `--bili-color-info` | 信息 | `#8a919f` |
| `--bili-text-primary` | 主要文字 | `#1f2329` |
| `--bili-text-regular` | 常规文字 | `#4e5969` |
| `--bili-text-secondary` | 次要文字 | `#86909c` |
| `--bili-text-placeholder` | 占位文字 | `#b4bac3` |
| `--bili-bg-page` | 页面背景 | `#f5f6f8` |
| `--bili-bg-container` | 容器背景 | `#ffffff` |
| `--bili-bg-elevated` | 浮层背景 | `#ffffff` |
| `--bili-border-color` | 边框 | `#d7dbe0` |
| `--bili-fill-color` | 填充 | `#f2f3f5` |

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
  --bili-bg-page: #121417;
  --bili-bg-container: #1b1e23;
  --bili-text-primary: #e8eaed;
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

每个组件都暴露以 `--bili-<component>-` 开头的变量，可以只改某个组件的局部样式：

```css
/* 只放大大号按钮，不影响其他尺寸 */
.bili-button--lg {
  --bili-button-padding: 22px;
}

/* 调整输入框圆角 */
.bili-input {
  --bili-input-height: 36px;
  border-radius: 10px;
}
```

常用组件变量：

| 组件 | 变量示例 |
| --- | --- |
| Button | `--bili-button-height`、`--bili-button-padding`、`--bili-button-bg` |
| Input | `--bili-input-height`、`--bili-input-padding` |
| Select | `--bili-select-height`、`--bili-select-padding` |
| Switch | `--bili-switch-width`、`--bili-switch-height` |

## 设计约束

- 尺寸统一为 `sm` / `md` / `lg`，对应控件高度 28 / 32 / 40 px。
- 文本与背景对比度以 WCAG AA 为基线，暗色模式会将主色提亮。
- 动效时长统一为 `0.2s`，缓动为 `cubic-bezier(0.4, 0, 0.2, 1)`。
