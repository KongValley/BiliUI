# Bili UI · Flat Editorial 视觉规范

> 方向：保留 `#E0356B` 品牌粉，以纸白、石墨灰与清晰留白建立层级，在不改动任何组件 API 的前提下提升整体质感。
> 状态：已按本规范落地到 `packages/bili-ui` 的令牌与组件样式（2026-11-13）。
> 预览：[component-preview.html](./component-preview.html)

## 1. 设计目标

| 目标 | 具体做法 |
| --- | --- |
| 更精致的品牌感 | 保留 B 站粉，但降低大面积粉色占比；粉色只出现在主操作、选中态、焦点环与关键数据 |
| 更清晰的层次 | 采用小幅圆角与清晰边框，以文字、留白和状态色建立层级；阴影令牌统一为 `none`，不使用装饰性投影 |
| 更明确的状态 | 默认、hover、focus、active、disabled、error 六态全部有独立视觉；焦点反馈使用清晰描边 |
| 更舒服的暗色 | 暗色不再简单反相：降低纯黑比例，使用带蓝调的炭灰，品牌粉提亮到 `#FB7299` |
| 零 API 变更 | 只修改设计令牌与组件 SCSS，Props / Events / Slots 保持不变 |

## 2. 设计令牌

### 2.1 颜色 · 亮色

| Token | 值 | 用途 |
| --- | --- | --- |
| `--bili-color-primary` | `#E0356B` | 主操作、选中、链接 |
| `--bili-color-primary-hover` | `#EC4A7C` | 主色 hover |
| `--bili-color-primary-active` | `#C4255B` | 主色 active |
| `--bili-color-primary-light` | `#FFF0F5` | 浅底、选中行、标签底色 |
| `--bili-color-primary-ring` | `rgba(224, 53, 107, 0.16)` | 3px 焦点环 |
| `--bili-color-danger-ring` | `rgba(229, 72, 77, 0.14)` | 错误态焦点环 |
| `--bili-text-primary` | `#26262B` | 标题、正文强调 |
| `--bili-text-regular` | `#55565E` | 常规正文 |
| `--bili-text-secondary` | `#878790` | 辅助说明 |
| `--bili-text-placeholder` | `#ACACB4` | 占位符 |
| `--bili-bg-page` | `#F8F8F9` | 页面底色 |
| `--bili-bg-container` | `#FFFFFF` | 卡片、控件底色 |
| `--bili-bg-muted` | `#F6F6F7` | 表头、只读区域 |
| `--bili-border-color` | `#DFDFE3` | 控件边框 |
| `--bili-border-color-light` | `#EAEAED` | 分割线、卡片边框 |
| `--bili-border-color-hover` | `#C7C7CE` | 控件 hover 边框 |

状态色保持现有语义色，仅统一浅底透明度：

| 状态 | 主色 | 浅底 |
| --- | --- | --- |
| success | `#22A06B` | `#EAF7F1` |
| warning | `#E6A23C` | `#FDF6EA` |
| danger | `#E5484D` | `#FDEDEE` |
| info | `#8A919F` | `#F3F4F6` |

### 2.2 颜色 · 暗色

| Token | 值 | 说明 |
| --- | --- | --- |
| `--bili-color-primary` | `#FB7299` | 暗色下提亮品牌粉 |
| `--bili-color-primary-hover` | `#FF8FB1` | |
| `--bili-color-primary-active` | `#E05C85` | |
| `--bili-color-primary-light` | `#3A1D27` | 暗色浅底 |
| `--bili-color-primary-ring` | `rgba(251, 114, 153, 0.22)` | |
| `--bili-text-primary` | `#F0F0F2` | |
| `--bili-text-regular` | `#C3C9D1` | |
| `--bili-text-secondary` | `#8B939E` | |
| `--bili-bg-page` | `#0F1115` | 比现有 `#121417` 略深、略冷 |
| `--bili-bg-container` | `#171A1F` | |
| `--bili-bg-elevated` | `#1E2228` | |
| `--bili-border-color` | `#2C323B` | |
| `--bili-border-color-light` | `#23282F` | |

### 2.3 圆角

| Token | 值 | 用途 |
| --- | --- | --- | --- |
| `--bili-radius-sm` | 6px | 小标签、复选框 |
| `--bili-radius-base` | 8px（Button 使用 6px） | 输入框、选择器、分页项 |
| `--bili-radius-md` | 10px | 小浮层 |
| `--bili-radius-lg` | 12px | 卡片 |
| `--bili-radius-xl` | 16px | Popover |
| `--bili-radius-round` | 999px | 胶囊、圆形按钮 |

### 2.4 阴影

| Token | 值 | 用途 |
| --- | --- | --- |
| `--bili-shadow-sm / base / md / lg` | `none` | 统一扁平化，使用边框表达层级 |

亮暗主题均使用 `none`，不再依赖投影区别浮层；背景、边框与焦点轮廓保持足够对比。

### 2.5 控件与间距

| Token | 值 |
| --- | --- |
| `--bili-control-height-sm` | 30px |
| `--bili-control-height-md` | 36px |
| `--bili-control-height-lg` | 42px |
| `--bili-control-padding-sm` | 12px |
| `--bili-control-padding-md` | 16px |
| `--bili-control-padding-lg` | 20px |
| `--bili-control-font-size` | 14px，独立于正文 |
| `--bili-space-1 … 8` | 4 / 8 / 12 / 16 / 20 / 24 / 32px |

### 2.6 字体与动效

| Token | 值 |
| --- | --- |
| `--bili-font-family` | 操作系统原生 UI 字体：`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`，不下载自定义字体 |
| `--bili-font-size-xs … xxl` | 13 / 14 / 16 / 18 / 19 / 22 / 26px（紧凑控件单独使用 14px） |
| `--bili-line-height-base` | 1.5 |
| `--bili-transition-duration-fast` | 120ms |
| `--bili-transition-duration` | 180ms |
| `--bili-transition-duration-slow` | 280ms |
| `--bili-transition-function` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--bili-transition-function-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |

## 3. 组件状态规范

### 3.1 Button

| 状态 | 背景 | 文字 | 边框 | 其他 |
| --- | --- | --- | --- | --- |
| default（primary） | `#E0356B` | `#FFF` | 同背景 | `shadow-sm` |
| hover | `#EC4A7C` | `#FFF` | 同背景 | 粉色柔光 `0 4px 12px rgba(224,53,107,.22)` |
| active | `#C4255B` | `#FFF` | 同背景 | `scale(.98)` |
| focus-visible | 不变 | 不变 | 不变 | `0 0 0 3px primary-ring` |
| disabled | 主色 | `#FFF` | 无 | `opacity .5`，无阴影 |
| loading | 主色 | 文字保留 | 无 | 图标旋转，禁止点击 |

次级按钮：白底 + `border-color`，hover 时文字转主色、边框转 `primary-ring`、底色 `primary-light`。

### 3.2 Input / Select

| 状态 | 边框 | 阴影 | 背景 |
| --- | --- | --- | --- |
| default | `#DFDFE3` | 无 | `#FFF` |
| hover | `#C7C7CE` | 无 | `#FFF` |
| focus | `#E0356B` | `0 0 0 3px primary-ring` | `#FFF` |
| error | `#E5484D` | `0 0 0 3px rgba(229,72,77,.14)` | `#FFF` |
| disabled | `#EDF0F3` | 无 | `#F2F3F5` |

高度 36px，内边距 0 16px，字号 14px，圆角 8px。Select 面板圆角 12px、`shadow-md`、内边距 4px，选项圆角 6px，选项文字不做位移动画。

### 3.3 Checkbox / Radio / Switch

- Checkbox：16×16，圆角 6px，选中主色底 + 白色对勾；hover 边框 `primary-hover`。
- Radio：16×16 圆形，选中时用 5px 主色边框形成圆点。
- Switch：36×20，滑块 16px；关闭底色 `fill-color`，开启主色；滑块带 `0 1px 3px rgba(0,0,0,.2)`。

### 3.4 Tabs

- 行高 40px，标签字号 14px；默认 `text-secondary`，hover `text-regular`，激活主色 + 600。
- 下划线 2px，圆角 2px，随激活项移动；`card` 类型激活项白底 + `shadow-sm`。
- 禁用项 `opacity .45`。

### 3.5 Card

- 圆角 12px，边框 `border-color-light`，内边距 20px，静止 `shadow-sm`。
- hover：`shadow-base` + `translateY(-2px)`（仅 `hoverable`）。
- 标题 16px / 600，描述 13px / `text-secondary`。

### 3.6 Table

- 表头：`bg-muted`，字号 12px / 500 / `text-secondary`，下边框 `border-color-light`。
- 行高 44px；行 hover `#F8F9FB`；选中行 `primary-light`。
- 单元格内边距 12px；首列左对齐，数字列右对齐。

### 3.7 Dialog / Drawer

- 圆角 16px，内边距 24px，`shadow-lg`。
- 遮罩 `rgba(22,22,26,.38)` 的纯色半透明层，不使用模糊滤镜。
- 标题 16px / 600；描述 13px / `text-secondary`；底部按钮右对齐、间距 8px。
- 进入：`opacity + scale(.96 → 1)`，180ms `ease-out`。

### 3.8 Message / Notification

- 圆角 12px，内边距 12px 16px，`shadow-md`，白底 + `border-color-light`。
- 左侧状态图标 18px；success / warning / danger / info 使用对应状态色。
- Message 顶部居中，间距 10px；Notification 右上角，宽 340px，间距 12px。
- 关闭按钮 hover 时显示 `fill-color` 圆形底。

### 3.9 Tag / Badge / Pagination

- Tag：高 22px，内边距 0 8px，圆角 6px；主色标签用 `primary-light` 底 + 主色文字。
- Badge：圆点 8px；数字徽标高 18px、圆角 9px、2px 容器色描边。
- Pagination：页码 32×32，圆角 8px；激活项主色底白字；hover `fill-color`。

### 3.10 Tooltip / Popover / Dropdown

- Tooltip：`#1D2129` 底、白字、12px、圆角 8px、内边距 6px 10px。
- Popover：白底、圆角 12px、`shadow-md`、内边距 16px，标题 14px / 600。
- Dropdown 菜单：圆角 12px、内边距 4px、`shadow-md`；菜单项高 32px、圆角 6px，hover `bg-muted`。

## 4. 与现状的差异

| 项目 | 调整前 | 已落地 |
| --- | --- | --- |
| 控件圆角 | 6px | 8px |
| 浮层圆角 | 8–12px | 12–16px |
| 边框色 | `#D7DBE0` | `#E3E6EA`（更轻） |
| 焦点反馈 | 3px 浅粉底 | 3px `primary-ring` + 主色边框 |
| 控件内边距 | 11px | 12px |
| 卡片阴影 | `0 4px 12px` | 更短、更柔的 `0 4px 14px` |
| 暗色页面底 | `#121417` | `#0F1115`（更冷） |
| 暗色边框 | `#3A404A` | `#2C323B`（更收敛） |
| 动效时长 | 200ms | 180ms，函数改为 `cubic-bezier(.2,0,0,1)` |

## 5. 落地顺序（确认后执行）

1. `styles/var.scss`：新增 `radius-xl`、`border-color-hover`、`primary-ring`、`danger-ring`，调整圆角 / 阴影 / 控件内边距。
2. `styles/theme/dark.scss`：替换暗色语义值，保持对比度 ≥ 4.5:1。
3. 基础控件：Button、Input、Select、Checkbox、Radio、Switch、Tag、Badge。
4. 容器与反馈：Card、Table、Tabs、Dialog、Drawer、Message、Notification、Tooltip、Popover、Dropdown、Pagination。
5. 回归：`typecheck` / `lint` / `test` / `build` / `docs:build`，并检查亮暗主题与焦点可见性。

## 6. 验收清单

- [ ] 所有可交互元素有 `:focus-visible` 焦点环，且键盘可达。
- [ ] 亮色下正文 / 辅助文字对比度 ≥ 4.5:1，暗色同理。
- [ ] 所有 hover / active / disabled 状态不使用仅靠颜色变化传达信息。
- [ ] 浮层层级、圆角、阴影在 Dialog / Drawer / Dropdown / Popover 中一致。
- [ ] 不新增硬编码色值，全部通过语义令牌引用。
