# @kongvalley/bili-ui

## 0.2.0

### Minor Changes

- e29a799: 新增 Segmented、List、VirtualList、Typography、Splitter、AutoComplete、Mention 组件；补充运行时主题色 API、SSR 冒烟测试与基础组件测试覆盖。
- 7045f54: 新增 MessageBox、Scrollbar、FloatButton、InputTag、CascaderPanel、TimeSelect 组件；补齐 AvatarGroup、BadgeRibbon、CardMeta/CardGrid、StatisticCountdown、SpaceCompact、InputSearch/InputOtp、DatePicker 月/年/日期时间、Typography 复制编辑、Tabs 新增标签，以及 RadarChart/ScatterChart/FunnelChart。
- b5424cf: 新增 Flex 弹性布局与 App 应用容器（含 `useApp()` 作用域服务）；Splitter 支持多面板与 `SplitterPanel`；Loading 新增 `BiliLoading.service()` 命令式遮罩。同时修复按需样式构建会删除组件类型声明的问题。
- 28f4a27: 采用「Flat Editorial」视觉体系：以纯色、细边框与状态底色建立层级，阴影令牌统一为 `none`，移除装饰性投影、悬浮抬升与模糊遮罩。正文与紧凑控件分别设定字号，默认控件高度为 30 / 36 / 42px，小幅圆角与清晰焦点描边保留。文档站支持 390–2560px 多档分辨率自适应，超宽屏不再叠加侧栏视口偏移；Menu 横向溢出与二级浮层改为纵向排列，并增加行间距、菜单项内边距与浮层留白；移除内联子菜单的竖向引导线。使用常规系统 UI 字体，不下载中文字体；保留原有 API、运行时主题色与暗色支持。

### Patch Changes

- df2005d: CodeBlock 的等宽字体栈改为优先 `Cascadia Code`，并修复高亮 token 与行号被全局 `[class^="bili-"]` 字体重置覆盖、导致代码正文实际回退为界面字体的问题；文档站的围栏代码块与行内代码同步使用同一等宽栈。
