# 动效

Bili UI 的动效目标是**让状态变化被看见，而不是炫技**。所有过渡都控制在 120–320ms 之间，只作用于 `color`、`background-color`、`border-color`、`box-shadow`、`transform`、`opacity` 等不影响布局的属性，避免引起回流和眩晕。

## 动效令牌

```css
:root {
  /* 时长 */
  --bili-transition-duration-fast: 0.12s; /* 按压、悬停等即时反馈 */
  --bili-transition-duration: 0.2s; /* 常规状态过渡 */
  --bili-transition-duration-slow: 0.32s; /* 弹层入场、对话框 */

  /* 缓动 */
  --bili-transition-function: cubic-bezier(0.4, 0, 0.2, 1); /* 标准 */
  --bili-transition-function-out: cubic-bezier(0.16, 1, 0.3, 1); /* 入场：快进慢停 */
  --bili-transition-function-in: cubic-bezier(0.4, 0, 1, 1); /* 出场：渐快离场 */
  --bili-transition-function-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* 弹性回弹 */

  /* 按压缩放系数 */
  --bili-press-scale: 0.96;
}
```

业务侧只需覆盖这些变量即可整体调节动效节奏：

```css
/* 让所有动效更克制 */
:root {
  --bili-transition-duration-fast: 0.08s;
  --bili-transition-duration: 0.15s;
  --bili-transition-duration-slow: 0.2s;
  --bili-press-scale: 0.98;
}
```

## 各组件的动效

| 组件 | 动效 |
| --- | --- |
| Button | 悬停变色、按下缩放至 `--bili-press-scale`、悬停时图标轻微放大、loading 图标淡入 |
| Icon | `spin` 持续旋转 |
| Tag | 关闭按钮悬停放大并填充、按下回落 |
| Input | 聚焦时出现 3px 光环（`box-shadow` 过渡）、清空/密码按钮弹出与缩放 |
| Checkbox | 勾选图标弹入、按下时方框回缩 |
| Radio | 圆点从中心弹性放大、按下时回缩 |
| Switch | 滑块弹性滑移、按下时滑块变宽（近似挤压感） |
| Select | 箭头翻转、面板缩放淡入、悬停项左移、选中项显示圆点标记 |
| Form | 错误信息上移淡入、校验失败时控件轻微抖动 |
| Tooltip | 从触发元素方向缩放淡入 |
| Dialog | 遮罩淡入 + 面板下移缩放，关闭时反向且更快 |
| Message | 从顶部滑入并轻微放大，关闭时加速离场；自动关闭时底部显示倒计时进度条，悬停可暂停 |
| Loading | 旋转动画、遮罩淡入淡出，`v-loading` 卸载时先播放淡出 |
| Table | 行悬停时单元格背景过渡、排序箭头选中放大 |
| Pagination | 悬停变色过渡、按下缩放；页码始终同基线对齐，不做位移或缩放动画 |

## 共享过渡与关键帧

`src/styles/base.scss` 中预置了可复用的过渡类：

```html
<!-- 淡入淡出 -->
<Transition name="bili-fade">…</Transition>

<!-- 缩放淡入，可通过 --bili-zoom-origin 指定变换原点 -->
<Transition name="bili-zoom">…</Transition>
```

可用的关键帧：

| 名称 | 用途 |
| --- | --- |
| `bili-rotate` | 旋转（loading） |
| `bili-fade-in` | 淡入 |
| `bili-pop-in` | 从 0.8 缩放弹入并回弹 |
| `bili-shake` | 水平抖动（错误提示） |

## 无障碍：尊重系统设置

组件库内置 `prefers-reduced-motion` 支持：当用户在操作系统中开启「减少动态效果」时，所有过渡与动画会被压缩至接近瞬时，但**加载转圈会保留**，以免失去加载状态的可见性。

```css
@media (prefers-reduced-motion: reduce) {
  [class^='bili-'],
  [class*=' bili-'] {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

如果需要为单个区域单独关闭动效，可以在容器上显式覆盖：

```css
.no-motion .bili-button {
  transition: none;
}
```

## 设计约束

- 不使用位移超过 24px 的入场，避免视线大幅跳动。
- 同一层级内只使用一种入场方向，避免元素从四面八方飞入。
- 出场动画时长不大于入场动画，保证操作响应干脆。
- 不对布局属性（`width`、`height`、`margin`、`padding`）做过渡，除非是内部装饰元素（如开关滑块）。
