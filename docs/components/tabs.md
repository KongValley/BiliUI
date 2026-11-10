---
title: Tabs 标签页
---

# Tabs 标签页

页面内分区切换，支持下划线、卡片、分段三种样式，横向与纵向布局，以及懒加载、可关闭标签与键盘导航。

<script setup>
import DemoBasic from '../examples/tabs/basic.vue'
import basicCode from '../examples/tabs/basic.vue?raw'
import DemoEditable from '../examples/tabs/editable.vue'
import editableCode from '../examples/tabs/editable.vue?raw'
</script>

## 基础用法

`v-model` 绑定激活标签的 `name`；下划线会跟随激活项平滑移动。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 可关闭与懒加载

`closable` 配合 `TabPane` 的 `closable` 显示关闭按钮；`lazy` 让未访问过的面板延迟挂载。

<DemoBlock :code="editableCode">
  <DemoEditable />
</DemoBlock>

## API

### Tabs Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 激活标签的 `name` | `string \| number` | — |
| `type` | 样式类型 | `'line' \| 'card' \| 'segment'` | `'line'` |
| `direction` | 布局方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `lazy` | 是否延迟挂载未访问的面板 | `boolean` | `false` |
| `closable` | 是否允许关闭声明了 `closable` 的标签 | `boolean` | `false` |
| `stretch` | 标签是否等分宽度 | `boolean` | `false` |
| `animated` | 下划线是否带动画 | `boolean` | `true` |

### TabPane Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `name` | 唯一标识，必填 | `string \| number` | — |
| `label` | 标签文字 | `string` | `''` |
| `icon` | 标签图标名 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `closable` | 是否显示关闭按钮 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 激活项变化 | `(value: string \| number)` |
| `tab-click` | 点击标签时触发 | `({ name, pane })` |
| `tab-remove` | 点击关闭时触发 | `(name: string \| number)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | `TabPane` 列表 |
| `extra` | 标签栏右侧操作区 |

## 说明

- 激活项改变时，下划线通过测量标签位置后用 `transform` 移动，避免布局抖动。
- 聚焦标签栏后可用 `←` / `→` / `Home` / `End` 切换，禁用项自动跳过。
- `card` 与 `segment` 类型不渲染下划线；`segment` 会自动收缩为内容宽度。
- 关闭标签不会自动删除数据，需要在 `tab-remove` 中维护面板数组，示例演示了完整写法。
