---
title: Collapse 折叠面板
---

# Collapse 折叠面板

通过折叠收纳内容，常用于 FAQ、设置分组与详情展开。

<script setup>
import DemoBasic from '../examples/collapse/basic.vue'
import basicCode from '../examples/collapse/basic.vue?raw'
</script>

## 基础用法

`v-model` 绑定展开面板的 `name` 数组；`accordion` 开启手风琴模式。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Collapse Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 展开的面板名，数组或单个值 | `string \| number \| Array` | — |
| `accordion` | 手风琴模式，最多一个展开 | `boolean` | `false` |
| `bordered` | 是否显示外边框 | `boolean` | `true` |

### CollapseItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `name` | 唯一标识，必填 | `string \| number` | — |
| `title` | 标题 | `string` | `''` |
| `icon` | 标题前的图标名 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `hideBorder` | 隐藏标题下方分隔线 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 展开状态变化 | 新值 |
| `change` | 同上 | 新值 |
| `item change` | 单个面板展开/收起 | `(open: boolean)` |

### Slots

`CollapseItem` 支持 `title` 插槽与默认内容插槽。

## 说明

- 面板内容使用 `v-show` 保留 DOM，展开时带淡入上移的过渡。
- 标题区域支持键盘操作（`Enter` / 空格），带 `aria-expanded`。
- 手风琴模式下点击已展开的面板会将其收起。
