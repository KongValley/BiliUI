# Bili UI 组件开发计划

> 现状：62 个组件目录 / 85 个对外组件，531 个单测。
> 进度：P0、P1、P2、P3 已全部完成。
> 每个组件的完成标准一致：`index.ts` + `src` + `style` + `__tests__` + 文档页 + 示例 + 注册导出 + 全量校验通过。

## 批次划分

| 批次 | 目标               | 组件数 | 状态      | 说明                             |
| ---- | ------------------ | ------ | --------- | -------------------------------- |
| P0   | 补齐页面级高频刚需 | 8      | ✅ 已完成 | 缺了它们几乎做不了完整业务页面   |
| P1   | 中后台进阶场景     | 10     | ✅ 已完成 | 分步流程、上传、日期、气泡卡片等 |
| P2   | 现有组件能力补强   | 4 项   | ✅ 已完成 | 提升既有组件的深度而非广度       |
| P3   | 长尾组件池         | 17     | ✅ 已完成 | 长尾能力已全部落地               |

---

## P0 · 高频刚需（8 个，已完成 ✅）

### 1. Tabs 标签页 ✅

- 模式：`line`（下划线）/ `card`（卡片）/ `segment`（分段控件）
- 方向：横向 / 纵向
- 交互：禁用项、可关闭标签、`lazy` 懒加载面板、标签溢出滚动
- 动效：下划线随激活项滑动（用 `transform` + 测量宽度），面板切换淡入
- API：`v-model`、`Tabs` + `TabPane` 两个组件、`tab-click` / `tab-change` / `tab-remove`

### 2. Badge 徽标 ✅

- 形态：数字 / 圆点 / 文字
- 能力：`max` 封顶显示 `99+`、独立使用与包裹内容两种用法、`show-zero`、状态色（success/processing/default/error/warning）
- 动效：数字变化时轻微弹跳

### 3. Progress 进度条 ✅

- 类型：`line` / `circle` / `dashboard`
- 状态：`normal` / `success` / `warning` / `error`，支持自定义颜色与渐变
- 能力：`indeterminate` 不确定态、区间进度（`success-percent` 双色）、`stroke-width`、内部文字与自定义 format
- 动效：数值变化时宽度/弧长平滑过渡

### 4. Alert 警告提示 ✅

- 类型：info / success / warning / error
- 能力：标题 + 描述、可关闭（带离场动画）、`show-icon`、`bordered`、`closable` 受控
- 插槽：`title` / `description` / `icon` / `action`（右侧操作区）

### 5. Skeleton 骨架屏 ✅

- 原子：`Skeleton`（段落行）+ `SkeletonItem`（text / image / circle / rect / button）
- 能力：`rows` 行数、`animated` 扫光、`loading` 切换后渲染真实内容
- 预设：`avatar` 组合、卡片骨架、表格骨架

### 6. Empty 空状态 ✅

- 预设插画：default / simple / search / data
- 能力：自定义 `description`、`image` 插槽、底部操作区
- 落地：替换 Table / Select / Chart 内部各自实现的空态，统一到该组件

### 7. Breadcrumb 面包屑 ✅

- 能力：自定义分隔符（含插槽）、`BreadcrumbItem` 的 `to` / `replace`、当前项不可点
- 溢出：超过 `max-items` 时折叠中间项为「…」下拉

### 8. Dropdown 下拉菜单 ✅

- 触发：`hover` / `click` / `contextmenu`
- 能力：`placement`、禁用项、分割线、图标、快捷键提示、选中态
- 复用：`useFloating` + `useClickOutside`，与 Select 共用弹出面板样式

### P0 收口 ✅

单测（每组件 ≥6 例）→ 文档页与示例 → `components.ts` 注册导出 → 样式入口 → README / 首页计数 → `typecheck` / `lint` / `test` / `build` / `docs:build` → 亮暗主题浏览器验收

---

## P1 · 中后台进阶（10 个）

### 9. Steps 步骤条 ✅

横向 / 纵向、`wait` / `process` / `finish` / `error` 状态、自定义图标、点击跳转、`simple` 简洁模式。

### 10. Collapse 折叠面板 ✅

`Collapse` + `CollapseItem`、手风琴模式、禁用、箭头位置、内容高度过渡动画。

### 11. Popover / Popconfirm ✅

Popover 承载富内容（标题 + 正文 + 操作）；Popconfirm 提供确认/取消与异步 loading。复用 Tooltip 的定位、箭头与 `visible` 受控逻辑，抽出公共的 `use-popup` 组合式函数。

### 12. Descriptions 描述列表 ✅

`Descriptions` + `DescriptionsItem`、列数自适应、`span` 跨列、`bordered` 表格线、`direction` 垂直布局。

### 13. InputNumber / Slider ✅

- InputNumber：步进、精度、范围限制、长按连续增减、格式化
- Slider：单值/区间、刻度标记、`show-tooltip`、垂直方向、禁用与离散点

### 14. Upload 上传 ✅

点击选择 / 拖拽上传、多文件、文件列表（进度/失败/重试/删除）、图片卡片与预览、`before-upload` 与自定义 `http-request`、`accept` / `limit`。

### 15. DatePicker / TimePicker ✅

- DatePicker：日/月/年三种视图、单日与范围选择、快捷选项（今天/近 7 天/本月）、禁用日期、清空
- TimePicker：小时/分钟/秒列选择、步长、禁用时间、当前时间快捷填充
- 两者均支持 Teleport 浮层、`popper-class`、ConfigProvider 尺寸、键盘 `Esc` 关闭与清空

### 16. Result 结果页 ✅

success / warning / info / error / 403 / 404 / 500 预设插画、标题 + 副标题、额外操作区。

### 17. Notification 通知 ✅

右上角通知卡片、四类型、标题 + 描述、自动关闭进度条、手动关闭、堆叠与最大数量。

### P1 收口 ✅

与 P0 相同的收口清单，另加：Popup 公共逻辑抽离后回归 Tooltip / Select / Menu / Dropdown 四个组件。P1 已全部完成。

---

## P2 · 现有组件能力补强（4 项，已完成 ✅）

### 18. Select ✅

- `multiple` 多选 + tags 折叠（`max-tag-count`）+ 全选
- 选项分组（`OptionGroup`）
- 远程搜索（`filter-method` / `remote` + loading 态）
- 虚拟滚动（选项超过 200 条时）

### 19. Table ✅

- 固定列（`fixed: 'left' | 'right'`）与固定表头
- 展开行（`expandable` + `expand` 插槽）
- 树形数据（`children` + `tree-props`）
- 合计行（`summary-method`）
- 虚拟滚动（大数据量）

### 20. Input / Form ✅

- Input：`prepend` / `append` 组合、`InputNumber` 联动
- Form：动态增减字段（`FormList`）、`validateFields` 局部校验、跨字段依赖校验、`scrollToError`

### 21. Grid ✅

`flex` 模式（`justify` / `align` + 自动宽度）、`span` 在 flex 下的自适应、断点补全 `xs` / `sm` / `md` / `lg` / `xl` / `xxl`。

---

## P3 · 长尾组件池（17 个，已完成 ✅）

已完成：**Cascader 级联选择 ✅、Tree / TreeSelect ✅、Transfer 穿梭框 ✅、Rate 评分 ✅、ColorPicker 取色器 ✅、Calendar 日历 ✅、Timeline 时间线 ✅、Statistic 数值统计 ✅、Image 图片预览 ✅、Carousel 走马灯 ✅、Anchor 锚点 ✅、BackTop 回到顶部 ✅、Affix 固钉 ✅、Watermark 水印 ✅、Tour 引导 ✅、QRCode 二维码 ✅、ConfigProvider 全局配置 ✅**。

P3 组件池已全部完成，后续按业务反馈补充新组件。

---

## 下一批建议

1. 发布流程：接入 `changeset`、npm 发布与 CI 全量校验。
2. SSR / Nuxt 适配：Teleport、ResizeObserver 与 `document` 访问点冒烟测试。
3. 文档站增强：示例在线编辑已支持，可继续增加分享链接与 API 表按组件内嵌。
4. 按业务反馈补充新组件，并在新增文案时同步扩充 `BiliLocale` 字段。

---

## 工程侧待办（与组件并行）

- ✅ ConfigProvider：全局尺寸、`zIndex` 起点、`namespace` 前缀与 `zhCNLocale` / `enUSLocale` 完整国际化均已接入
- ✅ 样式覆写：50+ 组件提供组件级 CSS 变量，BackTop / Affix / Watermark / QRCode 的动态尺寸与位置改为 CSS 变量消费；浮层支持 `popper-class` / `overlay-class` / `panel-class` / `preview-class`，多实例主题可隔离
- ✅ 文档站新增《样式覆写》指南，主题文档与组件 API 表同步更新
- ✅ 按需样式：`styles/index.scss` 保持全量入口，同时生成 `dist/components/<component>/style.css`，支持 `import 'bili-ui/components/button/style.css'`（含依赖样式与设计令牌）
- ✅ 示例可编辑：DemoBlock 支持在线编辑、运行、重置与取消，编译结果使用独立 scoped 样式
- ✅ API 表自动生成：`vue-component-meta` 扫描 85 个组件生成 `/guide/api` 参考页
- ⏳ SSR / Nuxt：现有 `Teleport`、`ResizeObserver`、`document` 访问点做一轮 SSR 冒烟测试
- ✅ 文档站组件搜索（VitePress local search 已接入）
- ⏳ 发布：`changeset` 版本管理 + npm 发布流程 + CI 跑全量校验
