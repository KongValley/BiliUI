---
title: Switch 开关
---

# Switch 开关

表示两种状态之间的切换，支持自定义选中值、状态文字与加载状态。

<script setup>
import DemoBasic from '../examples/switch/basic.vue'
import basicCode from '../examples/switch/basic.vue?raw'
</script>

## 基础用法

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 绑定值 | `boolean \| string \| number` | `false` |
| `active-value` | 选中时的值 | `boolean \| string \| number` | `true` |
| `inactive-value` | 未选中时的值 | `boolean \| string \| number` | `false` |
| `active-text` | 选中时显示的文字 | `string` | `''` |
| `inactive-text` | 未选中时显示的文字 | `string` | `''` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否加载中 | `boolean` | `false` |
| `width` | 自定义轨道宽度 | `string \| number` | `44px` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 切换后的值 | `(value: boolean \| string \| number)` |
| `change` | 切换后的值 | `(value: boolean \| string \| number)` |

## 说明

组件使用原生 `button` 并附加 `role="switch"` / `aria-checked`，支持键盘聚焦与空格触发。
