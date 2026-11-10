---
title: ColorPicker 取色器
---

# ColorPicker 取色器

用于选择十六进制颜色，提供饱和度/明度面板、色相滑条、hex 输入与预设色板。

<script setup>
import DemoBasic from '../examples/color-picker/basic.vue'
import basicCode from '../examples/color-picker/basic.vue?raw'
import DemoPresets from '../examples/color-picker/presets.vue'
import presetsCode from '../examples/color-picker/presets.vue?raw'
</script>

## 基础用法

点击触发器打开面板：拖动左侧面板选择饱和度与明度，拖动色相条调整色相，也可以在输入框中直接输入 `#rrggbb`。`v-model` 绑定小写 hex 字符串，`clearable` 允许清空。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 自定义预设

`presets` 接收一组 hex 颜色，渲染为面板底部色板，点击即可选中。

<DemoBlock :code="presetsCode">
  <DemoPresets />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 绑定的颜色值，`#rrggbb` | `string` | `''` |
| `placeholder` | 占位文本 | `string` | `'请选择颜色'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `presets` | 预设颜色列表 | `string[]` | 内置 12 色 |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | 颜色变化 | `(value: string)` |
| `change` | 颜色变化（拖动、输入或预设） | `(value: string)` |
| `visible-change` | 面板显隐变化 | `(visible: boolean)` |
| `clear` | 点击清空 | — |
| `focus` / `blur` | 焦点变化 | `(event: FocusEvent)` |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `open()` / `close()` | 打开 / 关闭面板 |
| `focus()` | 聚焦触发器 |

## 说明

- 颜色统一以 `#rrggbb` 小写形式回写，输入 `#rgb` 或大写会自动归一化。
- 当前版本不包含透明度（alpha）通道，适合主题色、标签色等不透明场景。
- 拖动面板或色相条时会持续触发 `change`，需要节流时可在业务侧处理。
- 面板通过 Teleport 挂载到 `body`，点击外部或按 `Esc` 关闭。
