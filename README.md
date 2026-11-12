# Bili UI

Bili UI 是一套基于 **Vue 3 + TypeScript** 的 PC 端组件库，采用 **SCSS + BEM + CSS 变量** 构建设计令牌体系，内置亮/暗双主题、完整的 TypeScript 类型声明与 VitePress 文档站。

## 特性

- **115 个对外组件**：覆盖基础、布局、表单、反馈、数据展示与图表场景
- **三层设计令牌**：SCSS 原始值 → 语义 CSS 变量 → 组件变量，支持运行时换肤
- **亮暗双主题**：通过 `html.dark` 切换，所有组件内置暗色语义适配
- **运行时主题色**：`setThemeColor` 自动派生亮暗状态变量，文档站支持预设与自定义颜色切换
- **TypeScript 友好**：Props、Events、Slots 均有类型推导，构建产物附带 `.d.ts`
- **ESM + CJS**：支持全量安装与具名引入，ESM 产物可摇树
- **质量保障**：763 个单元测试覆盖核心交互与表单校验
- **全局配置**：ConfigProvider 支持尺寸、z-index、自定义命名空间与中英文完整国际化

## 技术栈

| 领域 | 方案                                        |
| ---- | ------------------------------------------- |
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 语言 | TypeScript                                  |
| 构建 | Vite Library Mode + vite-plugin-dts         |
| 样式 | Sass + BEM + CSS Variables                  |
| 定位 | @floating-ui/dom                            |
| 测试 | Vitest + @vue/test-utils + jsdom            |
| 文档 | VitePress                                   |

## 快速开始

```bash
pnpm install
pnpm dev        # 启动文档站 http://localhost:5173
pnpm test       # 运行单元测试
pnpm typecheck  # 类型检查
pnpm build      # 构建组件库（JS + d.ts + CSS）
pnpm docs:build # 构建文档站
```

## 使用方式

```ts
import { createApp } from 'vue'
import BiliUI from 'bili-ui'
import 'bili-ui/style.css'
import App from './App.vue'

createApp(App).use(BiliUI).mount('#app')
```

按需引入：

```vue
<script setup lang="ts">
import { BiliButton, BiliInput } from 'bili-ui'
import 'bili-ui/components/button/style.css'
import 'bili-ui/components/input/style.css'
</script>

<template>
  <BiliInput v-model="value" placeholder="请输入" clearable />
  <BiliButton type="primary">提交</BiliButton>
</template>
```

暗色模式：

```ts
document.documentElement.classList.toggle('dark')
```

## 目录结构

```text
.
├─ packages/bili-ui/          # 组件库
│  ├─ src/components/         # 每个组件：index / src / style / __tests__
│  ├─ src/hooks/              # useFloating、useNamespace、useClickOutside 等
│  ├─ src/utils/              # 安装器、DOM/对象工具
│  └─ src/styles/             # 设计令牌、暗色主题、BEM mixins
├─ docs/                      # VitePress 文档与在线示例
│  ├─ components/             # 75 篇组件文档
│  └─ examples/               # 可交互示例源码
└─ pnpm-workspace.yaml
```

## 组件

**基础**：Button、Icon（131 个内置图标）、Space / SpaceCompact、Divider、Tag、Typography（Title/Paragraph/Text/Link，可复制/编辑）、CodeBlock（语法高亮/行号/复制）、Avatar / AvatarGroup（图片/图标/首字母回退）、Badge / BadgeRibbon（数字/圆点/状态点/缎带）、ConfigProvider（全局尺寸/层级/文案）

**布局**：Layout（Header/Aside/Content/Footer）、Splitter（水平/垂直可拖拽面板）、Scrollbar（自定义滚动条）、Grid（Row/Col 24 栅格 + flex + xxl）、Menu（横向/竖向/折叠）、Tabs（下划线/卡片/分段/可新增）、Breadcrumb、Dropdown、Anchor（滚动监听/嵌套/平滑定位）、Affix（顶部/底部固钉）、BackTop（回到顶部）、FloatButton / FloatButtonGroup（悬浮操作）

**表单**：Input / InputSearch / InputOtp（前后置组合/搜索框/验证码）、InputTag（标签输入）、InputNumber、Slider、Upload、Checkbox / CheckboxGroup、Radio / RadioGroup、Segmented（分段控制器）、Switch、Select（多选/分组/远程/虚拟滚动）、AutoComplete（本地/异步补全）、Mention（@ 提及）、Cascader / CascaderPanel（级联/级联面板）、TreeSelect、ColorPicker（取色器）、DatePicker（日/月/年/区间/日期时间/快捷项）、TimePicker（时/分/秒/步长/禁用）、TimeSelect（固定时间点）、Transfer（穿梭框）、Rate（评分）、Form / FormItem / FormList

**反馈**：Tooltip、Popover / Popconfirm、Dialog、MessageBox（alert/confirm/prompt）、Drawer（四向滑出/焦点锁定）、Tour（分步引导）、Alert、Message、Notification、Loading（含 `v-loading` 指令）

**数据**：Card / CardMeta / CardGrid、Table（固定列/树形/展开/合计/虚拟滚动）、List（头部/分隔/加载/空状态）、VirtualList（固定行高虚拟滚动）、Tree（展开/复选/过滤）、Timeline（时间线）、Calendar（日历）、Statistic / StatisticCountdown（数值统计/倒计时）、Image（缩放/旋转/多图预览）、Carousel（自动播放/纵向/指示器）、Watermark（文字/图片水印）、QRCode（SVG 二维码）、Pagination、Progress、Skeleton、Empty、Steps、Collapse、Descriptions、Result

**图表**：LineChart、BarChart、PieChart、GaugeChart、RadarChart、ScatterChart、FunnelChart（SVG 自绘，零额外依赖）

## 设计体系

- 主色：`#e0356b`（暗色模式提亮为 `#fb7299`）
- 控件尺寸：`sm` / `md` / `lg` → 28 / 32 / 40px
- 字号：12 / 13 / 14 / 16 / 18 / 20px
- 间距：4 / 8 / 12 / 16 / 20 / 24 / 32px
- 圆角：4 / 6 / 8 / 12px 与胶囊圆角
- 动效：`0.2s cubic-bezier(0.4, 0, 0.2, 1)`

完整设计说明见文档站「设计规范」与「主题定制」。

## Roadmap

P0–P5 已全部完成。组件级样式变量、按需样式、示例在线编辑 / 分享与自动生成 API 参考已落地。接下来：

- [x] `changeset` 发布流程、npm 发布配置与 GitHub Actions CI
- [x] SSR 渲染冒烟测试（Nuxt Module 与真实示例项目待补）
- [ ] 无障碍专项审计与可视化回归测试

## License

MIT
