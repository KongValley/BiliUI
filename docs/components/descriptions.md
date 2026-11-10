---
title: Descriptions 描述列表
---

# Descriptions 描述列表

以键值形式展示实体的详细属性，常用于详情页与订单页。

<script setup>
import DemoBasic from '../examples/descriptions/basic.vue'
import basicCode from '../examples/descriptions/basic.vue?raw'
</script>

## 基础用法

`column` 控制列数，`bordered` 绘制表格线，`direction` 切换标签位置。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Descriptions Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `string` | `''` |
| `column` | 列数，`auto` 时按项数铺满 | `number \| 'auto'` | `3` |
| `bordered` | 是否显示边框 | `boolean` | `false` |
| `labelWidth` | 标签宽度 | `string \| number` | `''` |
| `direction` | 标签位置 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |

### DescriptionsItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 标签文字 | `string` | `''` |
| `span` | 跨列数，超出列数时自动收敛 | `number` | `1` |
| `labelWidth` | 覆盖父级标签宽度 | `string \| number` | `''` |

### Slots

`Descriptions` 支持 `title` 与 `extra`；`DescriptionsItem` 支持 `label` 与默认值插槽。

## 说明

- 布局使用 CSS Grid，`column` 通过 CSS 变量注入，`span` 转换为 `grid-column: span N`。
- 竖向布局把标签放到值上方，适合信息密度较低的场景。
- 无边框模式下标签后会自动追加中文冒号。
