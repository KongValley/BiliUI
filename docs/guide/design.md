# 设计规范

Bili UI 的设计目标是：**清晰、克制、有温度**。阅读界面以内容和层级为先，紧凑控件以准确操作为先；品牌粉用于关键操作与选中态，不承担大面积装饰。

## 色彩

品牌主色为「招牌粉」`#e0356b`，用于主按钮、选中态、聚焦态与链接。语义色只表达状态，不参与装饰。焦点环统一使用 `--bili-color-primary-ring`，错误态使用 `--bili-color-danger-ring`。

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
--bili-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
```

使用操作系统原生的界面字体：Windows 由 Segoe UI 处理英文与中文界面，macOS / iOS 使用系统字体，其他平台优先使用 Roboto、Noto Sans 等可用字体。无需下载字体文件，也不会额外引入 CDN 请求。

正文使用系统常规字重（400），按钮、标题和状态文本使用 `500 / 600 / 700`。

| 令牌 | 字号 | 典型用途 |
| --- | --- | --- |
| `--bili-font-size-xs` | 13px | 辅助说明、标签、计数 |
| `--bili-font-size-sm` | 14px | 表格正文、分页 |
| `--bili-font-size-base` | 16px | 正文、说明文本 |
| `--bili-font-size-md` | 18px | 对话框标题 |
| `--bili-font-size-lg` | 19px | 区块标题 |
| `--bili-font-size-xl` | 22px | 页面标题 |

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
| `--bili-radius-sm` | 6px | 小标签、复选/单选 |
| `--bili-radius-base` | 8px | 按钮、输入框、分页项 |
| `--bili-radius-md` | 10px | 小浮层、下拉项 |
| `--bili-radius-lg` | 12px | 卡片、消息提示 |
| `--bili-radius-xl` | 16px | 对话框、抽屉、Popover |
| `--bili-radius-round` | 999px | 胶囊按钮、开关 |

采用扁平化视觉：阴影令牌统一为 `none`，使用清晰的边框、文字和状态底色区分层级，不使用装饰性投影或悬停抬升。焦点轮廓是功能反馈，保留清晰可见的描边。

## 尺寸

控件的三档尺寸保持统一：

| 尺寸 | 高度 | 内边距 | 字号 |
| --- | --- | --- | --- |
| `sm` | 30px | 12px | 14px |
| `md` | 36px | 16px | 14px |
| `lg` | 42px | 20px | 14px |

紧凑控件字号由 `--bili-control-font-size` 单独控制；正文保持 16px，避免把阅读字号直接塞进控件。

## 分辨率与响应式

- `< 960px`：单栏阅读，侧栏改为抽屉导航，右侧目录隐藏。
- `960–1439px`：保留左侧组件导航，正文占剩余宽度，右侧目录在空间不足时收起。
- `≥ 1440px`：文档内容由 `--vp-layout-max-width`（1504px）限制并居中，侧栏、正文、目录保持独立列宽。
- 宽屏下不再基于 `100vw` 给侧栏内部叠加第二份偏移；侧栏定位统一交给 VitePress 的外层栅格，避免高分辨率下菜单被推出可视区域。
- 已验证 `390 / 1024 / 1440 / 1920 / 2560px` 宽度，均无横向溢出。

## 动效

- 时长：`0.18s`（快速反馈 `0.12s`，弹层入场 `0.28s`）
- 缓动：标准 `cubic-bezier(0.2, 0, 0, 1)`，入场 `cubic-bezier(0.16, 1, 0.3, 1)`，弹性 `cubic-bezier(0.34, 1.56, 0.64, 1)`
- 只对 `color`、`background-color`、`border-color`、`box-shadow`、`transform`、`opacity` 做过渡，避免布局抖动。
- 内置 `prefers-reduced-motion` 支持，详见 [动效规范](./motion.md)。

## 命名

- 组件：`BiliButton`、`BiliSelect`
- CSS 类：`.bili-button`、`.bili-button__inner`、`.bili-button--primary`
- 状态：`.is-disabled`、`.is-checked`、`.is-open`
- CSS 变量：`--bili-color-primary`、`--bili-button-height`

BEM 结构保证样式可预测，业务侧可以通过覆盖类或变量完成定制，而不需要修改组件源码。
