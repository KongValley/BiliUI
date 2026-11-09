# 设计规范

Bili UI 的设计目标是：**清晰、克制、可预期**。组件在默认状态下保持安静，把强调留给主操作与关键状态。

## 色彩

品牌主色为「招牌粉」`#e0356b`，用于主按钮、选中态、聚焦态与链接。语义色只表达状态，不参与装饰。

| 角色 | 色值 | 说明 |
| --- | --- | --- |
| Primary | `#e0356b` | 主操作、选中、聚焦 |
| Success | `#22a06b` | 成功结果 |
| Warning | `#e6a23c` | 需要注意但可继续 |
| Danger | `#e5484d` | 错误与破坏性操作 |
| Info | `#8a919f` | 中性信息 |

浅色模式文字分为 `primary / regular / secondary / placeholder` 四级，避免在正文中使用低对比度灰色。

## 字体

```css
--bili-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
  'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

| 令牌 | 字号 | 典型用途 |
| --- | --- | --- |
| `--bili-font-size-xs` | 12px | 辅助说明、标签、计数 |
| `--bili-font-size-sm` | 13px | 表格表头、分页 |
| `--bili-font-size-base` | 14px | 正文、控件默认字号 |
| `--bili-font-size-md` | 16px | 对话框标题 |
| `--bili-font-size-lg` | 18px | 区块标题 |
| `--bili-font-size-xl` | 20px | 页面标题 |

## 间距

以 4px 为基础栅格，提供 4 / 8 / 12 / 16 / 20 / 24 / 32 七档：

```css
--bili-space-1: 4px;
--bili-space-2: 8px;
--bili-space-3: 12px;
--bili-space-4: 16px;
--bili-space-5: 20px;
--bili-space-6: 24px;
--bili-space-8: 32px;
```

常用组合：组件内边距 12px，表单项纵向间距 18px，区块间距 24–32px。

## 圆角与阴影

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--bili-radius-sm` | 4px | 小标签、复选/单选 |
| `--bili-radius-base` | 6px | 按钮、输入框、下拉项 |
| `--bili-radius-md` | 8px | 浮层、卡片 |
| `--bili-radius-lg` | 12px | 对话框 |
| `--bili-radius-round` | 999px | 胶囊按钮、开关 |

阴影只用于表达层级：`sm` 用于控件，`base` 用于下拉浮层，`md` 用于消息提示，`lg` 用于对话框。

## 尺寸

控件的三档尺寸保持统一：

| 尺寸 | 高度 | 内边距 | 字号 |
| --- | --- | --- | --- |
| `sm` | 28px | 8px | 13px |
| `md` | 32px | 11px | 14px |
| `lg` | 40px | 15px | 14px |

## 动效

- 时长：`0.2s`（快速反馈 `0.12s`，弹层入场 `0.32s`）
- 缓动：标准 `cubic-bezier(0.4, 0, 0.2, 1)`，入场 `cubic-bezier(0.16, 1, 0.3, 1)`，弹性 `cubic-bezier(0.34, 1.56, 0.64, 1)`
- 只对 `color`、`background-color`、`border-color`、`box-shadow`、`transform`、`opacity` 做过渡，避免布局抖动。
- 内置 `prefers-reduced-motion` 支持，详见 [动效规范](./motion.md)。

## 命名

- 组件：`BiliButton`、`BiliSelect`
- CSS 类：`.bili-button`、`.bili-button__inner`、`.bili-button--primary`
- 状态：`.is-disabled`、`.is-checked`、`.is-open`
- CSS 变量：`--bili-color-primary`、`--bili-button-height`

BEM 结构保证样式可预测，业务侧可以通过覆盖类或变量完成定制，而不需要修改组件源码。
