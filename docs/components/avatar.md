---
title: Avatar 头像
---

# Avatar 头像

用于展示用户或实体的头像，支持图片、图标、姓名首字母三种回退方式，文字头像会按姓名生成稳定的背景色。

<script setup>
import DemoBasic from '../examples/avatar/basic.vue'
import basicCode from '../examples/avatar/basic.vue?raw'
import DemoGroup from '../examples/avatar/group.vue'
import groupCode from '../examples/avatar/group.vue?raw'
</script>

## 基础用法

`src` 提供图片；没有图片时依次回退到默认插槽、`icon`、`name` 首字母。图片加载失败也会自动回退。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 头像组

`BiliAvatarGroup` 将多个头像叠放展示，`max` 控制可见数量，超出部分折叠为 `+N`；`size` / `shape` 会下发给子头像。

<DemoBlock :code="groupCode">
  <DemoGroup />
</DemoBlock>

### AvatarGroup Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `max` | 最多展示数量，0 为不限 | `number` | `0` |
| `size` | 子头像尺寸 | `string \| number` | 继承子头像默认值 |
| `shape` | 子头像形状 | `'circle' \| 'square'` | `'circle'` |
| `spacing` | 头像重叠距离，负值表示叠放 | `string \| number` | `-8` |

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `src` | 图片地址 | `string` | `''` |
| `alt` | 图片替代文本，同时作为无障碍标签 | `string` | `''` |
| `name` | 姓名，用于生成首字母与背景色 | `string` | `''` |
| `icon` | 无图片时使用的图标名 | `string` | `''` |
| `size` | 尺寸，支持 `sm` / `md` / `lg`、数字或 CSS 长度 | `string \| number` | `'md'` |
| `shape` | 形状 | `'circle' \| 'square'` | `'circle'` |
| `fit` | 图片填充方式 | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| `bordered` | 是否显示外圈描边 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `error` | 图片加载失败时触发 | `(event: Event)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义无图片时的内容 |

## 说明

- 图片加载失败后会自动切换到回退内容，替换 `src` 会重新尝试加载。
- 文字头像的背景色由 `name`（或 `alt`）哈希得到，同一个人始终得到同一种颜色；亮/暗主题有不同的色彩映射。
- 尺寸映射：`sm` = 24px、`md` = 32px、`lg` = 40px，也可以传 `48` 或 `'3rem'` 这类自定义尺寸。
- 中文名优先显示后两个字（如「王小明」→「小明」），英文名取前两个单词首字母（如「John Doe」→「JD」）。
