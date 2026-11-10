---
title: Rate 评分
---

# Rate 评分

用于打分与满意度评价，支持半星、允许清空、文案提示、只读 / 禁用与键盘调节。

<script setup>
import DemoBasic from '../examples/rate/basic.vue'
import basicCode from '../examples/rate/basic.vue?raw'
import DemoHalf from '../examples/rate/half.vue'
import halfCode from '../examples/rate/half.vue?raw'
</script>

## 基础用法

`v-model` 绑定当前分值，`count` 控制星星数量。`show-text` 配合 `texts` 展示对应文案；再次点击同一分值会清空（`allow-clear` 默认开启）。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 半星、只读与禁用

开启 `allow-half` 后点击星星左半边得到 `.5` 分。`readonly` 保留展示但不可交互，`disabled` 同时降低交互能力并禁用键盘。

<DemoBlock :code="halfCode">
  <DemoHalf />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前分值 | `number` | `0` |
| `count` | 星星数量 | `number` | `5` |
| `allow-half` | 是否允许半星 | `boolean` | `false` |
| `allow-clear` | 再次点击同分值是否清空 | `boolean` | `true` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | 选中颜色 | `string` | 主色 |
| `void-color` | 未选中颜色 | `string` | 占位色 |
| `show-text` | 是否显示分值文案 | `boolean` | `false` |
| `texts` | 各分值对应文案 | `string[]` | `[]` |
| `icon` | 图标名称 | `string` | `'star'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 分值变化 | `(value: number)` |
| `change` | 分值变化（用户操作） | `(value: number)` |

## 说明

- 根节点使用 `role="slider"`，支持 `←` / `↓` 减分、`→` / `↑` 加分、`Home` 归零、`End` 打满。
- 半星模式下键盘步长为 `0.5`，否则为 `1`。
- 鼠标移动会实时预览分值，移出后恢复到当前值。
- `texts` 按向上取整的索引取值，例如 `2.5` 分展示第 3 条文案。
