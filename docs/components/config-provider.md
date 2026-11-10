---
title: ConfigProvider 全局配置
---

# ConfigProvider 全局配置

为子树统一提供控件尺寸、浮层层级起点与国际化文案；支持嵌套，内层配置覆盖外层。

<script setup>
import DemoSize from '../examples/config-provider/size.vue'
import sizeCode from '../examples/config-provider/size.vue?raw'
import DemoLocale from '../examples/config-provider/locale.vue'
import localeCode from '../examples/config-provider/locale.vue?raw'
</script>

## 全局尺寸

`size` 作为 Button、Input、Select、InputNumber 的默认尺寸；组件显式传入 `size` 时仍以组件自身为准。

<DemoBlock :code="sizeCode">
  <DemoSize />
</DemoBlock>

## 国际化文案

`locale` 支持部分覆盖，会与外层文案合并。下面的示例同时定制了 Popconfirm 按钮与 Pagination 文案。

<DemoBlock :code="localeCode">
  <DemoLocale />
</DemoBlock>

## API

### Props

| 属性      | 说明                                                         | 类型                   | 默认值 |
| --------- | ------------------------------------------------------------ | ---------------------- | ------ |
| `size`    | 子组件默认尺寸                                               | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `z-index` | 浮层 z-index 起点，Dialog / Drawer / Tour 等会从该值向上递增 | `number`               | `2000` |
| `locale`  | 局部文案覆盖                                                 | `Partial<BiliLocale>`  | —      |

### BiliLocale

| 字段                             | 默认值                  | 使用位置     |
| -------------------------------- | ----------------------- | ------------ |
| `confirm` / `cancel`             | 确定 / 取消             | Popconfirm   |
| `close`                          | 关闭                    | Dialog、Tour |
| `empty` / `invalid`              | 暂无数据 / 内容无法生成 | QRCode       |
| `prev` / `next` / `finish`       | 上一步 / 下一步 / 完成  | Tour         |
| `total`                          | `共 {total} 条`         | Pagination   |
| `pageSize`                       | `{size} 条/页`          | Pagination   |
| `pageSizeLabel`                  | 每页条数                | Pagination   |
| `prevPage` / `nextPage`          | 上一页 / 下一页         | Pagination   |
| `jumpTo` / `jumpToPage` / `page` | 前往 / 跳转到页码 / 页  | Pagination   |

### Slots

| 插槽名    | 说明                   |
| --------- | ---------------------- |
| `default` | 需要应用配置的子树内容 |

## 组合式 API

自定义组件可以读取同一份配置：

```ts
import { useConfig, useLocale, formatLocale } from 'bili-ui'

const config = useConfig() // ComputedRef<{ size, zIndex, locale }>
const locale = useLocale() // ComputedRef<BiliLocale>

formatLocale(locale.value.total, { total: 20 }) // "共 20 条"
```

## 说明

- ConfigProvider 本身不渲染任何 DOM，不会影响布局。
- 嵌套时按字段合并：内层 `size` / `zIndex` 覆盖外层，`locale` 仅覆盖传入的字段。
- 浮层组件通过 `useZIndex` 读取 `zIndex` 起点，保证自定义配置后仍在宿主弹层之上。
- 当前接管尺寸的组件为 Button、Input、Select、InputNumber；后续组件会逐步接入同一份配置。
