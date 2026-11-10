---
title: ConfigProvider 全局配置
---

# ConfigProvider 全局配置

为子树统一提供控件尺寸、浮层层级起点、类名前缀与国际化文案；支持嵌套，内层配置覆盖外层。

<script setup>
import DemoSize from '../examples/config-provider/size.vue'
import sizeCode from '../examples/config-provider/size.vue?raw'
import DemoLocale from '../examples/config-provider/locale.vue'
import localeCode from '../examples/config-provider/locale.vue?raw'
import DemoEn from '../examples/config-provider/en.vue'
import enCode from '../examples/config-provider/en.vue?raw'
import DemoNamespace from '../examples/config-provider/namespace.vue'
import namespaceCode from '../examples/config-provider/namespace.vue?raw'
</script>

## 全局尺寸

`size` 作为 Button、Input、Select、InputNumber 等控件的默认尺寸；组件显式传入 `size` 时仍以组件自身为准。

<DemoBlock :code="sizeCode">
  <DemoSize />
</DemoBlock>

## 国际化文案

`locale` 支持部分覆盖，会与外层文案合并。下面的示例同时定制了 Popconfirm 按钮与 Pagination 文案。

<DemoBlock :code="localeCode">
  <DemoLocale />
</DemoBlock>

内置 `zhCNLocale`（默认）与 `enUSLocale` 两套完整文案，可直接整体切换：

<DemoBlock :code="enCode">
  <DemoEn />
</DemoBlock>

```ts
import { enUSLocale } from 'bili-ui'
```

也可以只覆盖少量字段，例如 `{ confirm: 'OK', cancel: 'Back' }`，其余字段继续使用当前语言。

## 命名空间

`namespace` 会改写子树中所有组件生成的类名、CSS 变量前缀与过渡名称。默认值为 `bili`。

<DemoBlock :code="namespaceCode">
  <DemoNamespace />
</DemoBlock>

- 类名：`bili-button` → `acme-button`，元素类 `bili-button__icon` → `acme-button__icon`。
- CSS 变量：`--bili-color-primary` → `--acme-color-primary`。
- Teleport 到 `body` 的浮层（Dialog、Select 下拉、Message 等）同样使用新前缀。
- 运行时会把当前页面中同源、包含 `bili-` 的样式规则复制一份并替换前缀后注入 `<style data-bili-namespace="acme">`。跨域 CDN 样式无法读取，若使用独立命名空间请确保样式同源，或自行提供对应的 `acme-*` 样式。

## API

### Props

| 属性        | 说明                                                         | 类型                   | 默认值   |
| ----------- | ------------------------------------------------------------ | ---------------------- | -------- |
| `size`      | 子组件默认尺寸                                               | `'sm' \| 'md' \| 'lg'` | `'md'`   |
| `z-index`   | 浮层 z-index 起点，Dialog / Drawer / Tour 等会从该值向上递增 | `number`               | `2000`   |
| `namespace` | 类名与 CSS 变量前缀                                          | `string`               | `'bili'` |
| `locale`    | 局部文案覆盖，与父级文案深合并                               | `Partial<BiliLocale>`  | —        |

### BiliLocale

完整字段如下，所有组件在未显式传参时都会回退到当前语言。

#### 通用与表单

| 字段                                            | 中文默认值                               |
| ----------------------------------------------- | ---------------------------------------- |
| `confirm` / `cancel` / `close` / `clear`        | 确定 / 取消 / 关闭 / 清空                |
| `empty` / `invalid` / `loading` / `retry`       | 暂无数据 / 内容无法生成 / 加载中… / 重试 |
| `remove` / `removeItem` / `expand` / `collapse` | 移除 / 移除 {label} / 展开 / 收起        |
| `selectAll` / `search` / `more`                 | 全选 / 搜索 / 更多                       |
| `selectPlaceholder` / `searchPlaceholder`       | 请选择 / 请输入关键字                    |
| `clearInput` / `showPassword` / `hidePassword`  | 清空 / 显示密码 / 隐藏密码               |
| `decrease` / `increase`                         | 减少 / 增加                              |
| `colorPickerPlaceholder` / `colorValue`         | 请选择颜色 / 颜色值                      |
| `slider` / `sliderLabel`                        | 滑块 {index}                             |

#### 分页

| 字段                             | 中文默认值                   |
| -------------------------------- | ---------------------------- |
| `total` / `pageSize`             | 共 {total} 条 / {size} 条/页 |
| `pageSizeLabel`                  | 每页条数                     |
| `prevPage` / `nextPage`          | 上一页 / 下一页              |
| `jumpTo` / `jumpToPage` / `page` | 前往 / 跳转到页码 / 页       |

#### 日期与时间

| 字段                                                              | 中文默认值                                    |
| ----------------------------------------------------------------- | --------------------------------------------- |
| `selectDate` / `startDate` / `endDate` / `rangeSeparator`         | 请选择日期 / 开始日期 / 结束日期 / 至         |
| `today` / `last7Days` / `thisMonth`                               | 今天 / 近 7 天 / 本月                         |
| `prevMonth` / `nextMonth`                                         | 上个月 / 下个月                               |
| `yearMonth` / `yearLabel` / `monthLabel`                          | {year} 年 {month} 月 / {year} 年 / {month} 月 |
| `weekdays`                                                        | `['日','一','二','三','四','五','六']`        |
| `clearDate`                                                       | 清空日期                                      |
| `selectTime` / `hour` / `minute` / `second` / `now` / `clearTime` | 请选择时间 / 时 / 分 / 秒 / 此刻 / 清空时间   |
| `prev` / `next` / `finish`                                        | 上一步 / 下一步 / 完成                        |

#### 浮层与反馈

| 字段                                             | 中文默认值                  |
| ------------------------------------------------ | --------------------------- |
| `dialog` / `drawer` / `message` / `notification` | 对话框 / 抽屉 / 消息 / 通知 |
| `notificationClose`                              | 关闭通知                    |
| `tourStep`                                       | 第 {index} 步               |

#### 表格、树与穿梭框

| 字段                                                      | 中文默认值                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| `sumText` / `sortPriority` / `resizeColumn` / `selectRow` | 合计 / 排序优先级 {priority} / 调整{column}列宽 / 选择第 {index} 行 |
| `transferTitles`                                          | `['列表 1', '列表 2']`                                              |
| `transferSelectAll` / `moveToRight` / `moveToLeft`        | 全选{title} / 移到右侧 / 移到左侧                                   |

#### 上传、图片与轮播

| 字段                                                       | 中文默认值                                       |
| ---------------------------------------------------------- | ------------------------------------------------ |
| `uploadFailed` / `uploadDrag` / `selectFile`               | 上传失败 / 点击或拖拽文件到此区域上传 / 选择文件 |
| `imagePreview` / `previewImage` / `preview` / `loadFailed` | 图片预览 / 预览图片 / 预览 / 图片加载失败        |
| `closePreview` / `prevImage` / `nextImage`                 | 关闭预览 / 上一张 / 下一张                       |
| `zoomOut` / `zoomIn` / `actualSize`                        | 缩小 / 放大 / 实际大小                           |
| `rotateLeft` / `rotateRight`                               | 向左旋转 / 向右旋转                              |
| `prevSlide` / `nextSlide` / `goToSlide`                    | 上一张 / 下一张 / 切换到第 {index} 张            |

#### 可访问性与图表

| 字段                                                 | 中文默认值                          |
| ---------------------------------------------------- | ----------------------------------- |
| `anchor` / `breadcrumb` / `avatar` / `backTop`       | 锚点导航 / 面包屑 / 头像 / 回到顶部 |
| `tabClose` / `progress` / `qrcode`                   | 关闭标签 / 进度 {percent}% / 二维码 |
| `copy` / `copied` / `copyCode`                       | 复制 / 已复制 / 复制代码            |
| `chartValue` / `chartPercent` / `chartTotal`         | 数值 / 占比 / 总计                  |
| `lineChart` / `barChart` / `pieChart` / `gaugeChart` | 图表 aria-label 模板                |

#### 表单校验

| 字段                                              | 中文默认值                           |
| ------------------------------------------------- | ------------------------------------ |
| `validationFailed` / `required`                   | 校验未通过 / 此项为必填项            |
| `email` / `url` / `array` / `number` / `pattern`  | 邮箱、网址、数组、数字、格式错误提示 |
| `min` / `max` / `len` / `minLength` / `maxLength` | 数值或长度校验模板                   |

### Slots

| 插槽名    | 说明                   |
| --------- | ---------------------- |
| `default` | 需要应用配置的子树内容 |

## 组合式 API

自定义组件可以读取同一份配置：

```ts
import { useConfig, useLocale, useNamespace, formatLocale, enUSLocale } from 'bili-ui'

const config = useConfig() // ComputedRef<{ size, zIndex, namespace, locale }>
const locale = useLocale() // ComputedRef<BiliLocale>
const ns = useNamespace('my-widget') // b / e / m / is / cssVar / transition

formatLocale(locale.value.total, { total: 20 }) // "共 20 条"
```

## 说明

- ConfigProvider 本身不渲染任何 DOM，不会影响布局。
- 嵌套时按字段合并：内层 `size` / `zIndex` / `namespace` 覆盖外层，`locale` 仅覆盖传入的字段。
- 浮层组件通过 `useZIndex` 读取 `zIndex` 起点，保证自定义配置后仍在宿主弹层之上。
- 命令式 API（`BiliMessage`、`BiliNotification`）会读取最近一次由 ConfigProvider 设置的 `namespace` / `locale`。
- 当前接管尺寸的组件为 Button、Input、Select、InputNumber 等表单控件；其余组件按需逐步接入。
