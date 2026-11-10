---
title: Cascader 级联选择
---

# Cascader 级联选择

用于从一组有层级关系的数据中逐级选择，支持任意层级、`change-on-select`、清空与自定义字段名。

<script setup>
import DemoBasic from '../examples/cascader/basic.vue'
import basicCode from '../examples/cascader/basic.vue?raw'
import DemoChangeOnSelect from '../examples/cascader/change-on-select.vue'
import changeOnSelectCode from '../examples/cascader/change-on-select.vue?raw'
</script>

## 基础用法

点击节点逐列展开，选择叶子节点后写回 `v-model` 并关闭面板。触发器展示从根到叶子的完整路径，默认使用 `/` 分隔。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 任意一级可选

开启 `change-on-select` 后，点击父节点也会立即更新值，同时继续展开下一列，适合「省 / 市」这类允许选择非叶子节点的场景。

<DemoBlock :code="changeOnSelectCode">
  <DemoChangeOnSelect />
</DemoBlock>

## 字段映射

默认读取 `label` / `value` / `children` / `disabled`，后端字段不同时通过 `field-names` 映射：

```vue
<BiliCascader
  v-model="value"
  :options="options"
  :field-names="{ label: 'name', value: 'id', children: 'items' }"
/>
```

## API

### Props

| 属性               | 说明                             | 类型                                       | 默认值       |
| ------------------ | -------------------------------- | ------------------------------------------ | ------------ |
| `model-value`      | 选中节点的值                     | `string \| number \| null`                 | —            |
| `options`          | 级联数据                         | `CascaderOption[]`                         | `[]`         |
| `field-names`      | 字段映射                         | `{ label?, value?, children?, disabled? }` | —            |
| `placeholder`      | 占位文本                         | `string`                                   | `'请选择'`   |
| `size`             | 尺寸                             | `'sm' \| 'md' \| 'lg'`                     | `'md'`       |
| `disabled`         | 是否禁用                         | `boolean`                                  | `false`      |
| `clearable`        | 是否可清空                       | `boolean`                                  | `false`      |
| `change-on-select` | 父节点是否可选中                 | `boolean`                                  | `false`      |
| `separator`        | 路径分隔符                       | `string`                                   | `' / '`      |
| `empty-text`       | 无数据文案                       | `string`                                   | `'暂无数据'` |
| `popper-class`     | 浮层额外类名，用于多实例主题隔离 | `string`                                   | `''`         |

`CascaderOption` 结构：

```ts
interface CascaderOption {
  label?: string
  value?: string | number
  children?: CascaderOption[]
  disabled?: boolean
}
```

### Events

| 事件名              | 说明         | 回调参数                                           |
| ------------------- | ------------ | -------------------------------------------------- |
| `update:modelValue` | 选中或清空   | `(value)`                                          |
| `change`            | 选中或清空   | `(value, path)`，`path` 为从根到当前节点的节点数组 |
| `visible-change`    | 面板显隐变化 | `(visible: boolean)`                               |
| `clear`             | 点击清空     | —                                                  |
| `focus` / `blur`    | 焦点变化     | `(event: FocusEvent)`                              |

### Exposes

| 方法                 | 说明              |
| -------------------- | ----------------- |
| `focus()` / `blur()` | 聚焦 / 失焦触发器 |
| `open()` / `close()` | 打开 / 关闭面板   |

## 说明

- 每个节点需要唯一的 `value`，否则路径匹配与选中态会不准确。
- 打开面板时会自动展开当前选中路径，便于继续切换。
- 面板通过 Teleport 挂载到 `body`，使用 Floating UI 定位并自动翻转。
- 支持 `↑` / `↓` 打开（`↓`）与 `Esc` 关闭的基础键盘操作。
