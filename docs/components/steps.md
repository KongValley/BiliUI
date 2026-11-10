---
title: Steps 步骤条
---

# Steps 步骤条

引导用户按流程完成操作，展示当前进度与各节点状态。

<script setup>
import DemoBasic from '../examples/steps/basic.vue'
import basicCode from '../examples/steps/basic.vue?raw'
</script>

## 基础用法

`active` 指定当前步骤下标，之前的步骤自动标记为完成。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Steps Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `active` | 当前步骤下标 | `number` | `0` |
| `direction` | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `processStatus` | 当前步骤的状态 | `'wait' \| 'process' \| 'finish' \| 'error'` | `'process'` |
| `simple` | 简洁模式，隐藏描述与连接线 | `boolean` | `false` |
| `clickable` | 是否允许点击跳转 | `boolean` | `false` |

### Step Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `string` | `''` |
| `description` | 描述 | `string` | `''` |
| `icon` | 自定义图标名 | `string` | `''` |
| `status` | 覆盖推导出的状态 | `'wait' \| 'process' \| 'finish' \| 'error'` | — |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:active` | 点击可跳转步骤时触发 | `(index: number)` |
| `change` | 同上，语义化别名 | `(index: number)` |

### Slots

`Step` 支持 `title` 与 `description` 插槽。

## 说明

- 完成态显示对勾图标，进行态显示序号并带高亮光环，错误态用危险色。
- `clickable` 时只能点击已完成或进行中的步骤，未开始的步骤不可跳转。
- 步骤数量与顺序由父组件注册的子步骤决定，`is-last` 自动隐藏末尾连接线。
