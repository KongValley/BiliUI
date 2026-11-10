---
title: CodeBlock 代码块
---

# CodeBlock 代码块

用于展示代码片段，内置零依赖的轻量语法高亮、行号、复制、标题与最大高度滚动。

<script setup>
import DemoBasic from '../examples/code-block/basic.vue'
import basicCode from '../examples/code-block/basic.vue?raw'
import DemoScroll from '../examples/code-block/scroll.vue'
import scrollCode from '../examples/code-block/scroll.vue?raw'
</script>

## 基础用法

通过 `language` 指定高亮语言，`title` 展示文件名，`show-line-numbers` 开启行号。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## 滚动与换行

`max-height` 控制最大高度，超出后纵向滚动且行号吸附在左侧；`wrap` 让超长行自动换行，`show-header` 可以隐藏头部。

<DemoBlock :code="scrollCode">
  <DemoScroll />
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `code` | 代码内容 | `string` | `''` |
| `language` | 语言标识，如 `ts` / `vue` / `css` / `json` / `bash` | `string` | `'text'` |
| `title` | 标题或文件名 | `string` | `''` |
| `show-line-numbers` | 是否显示行号 | `boolean` | `false` |
| `copyable` | 是否显示复制按钮 | `boolean` | `true` |
| `highlight` | 是否启用语法高亮 | `boolean` | `true` |
| `wrap` | 是否自动换行 | `boolean` | `false` |
| `max-height` | 最大高度，超出后纵向滚动 | `string \| number` | `''` |
| `show-header` | 是否显示头部 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `copy` | 复制成功后触发 | `(code: string)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `actions` | 头部右侧操作区，位于复制按钮之前 |

### Expose

| 方法 | 说明 |
| --- | --- |
| `copy` | 手动触发复制 |

## 说明

- 内置分词器覆盖 `js` / `ts` / `jsx` / `tsx`、`vue` / `html`、`css` / `scss`、`json`、`bash` 等常见语言，未知语言按纯文本展示。
- 渲染使用文本节点而非 `v-html`，代码内容不会被当作 HTML 执行。
- 高亮是轻量分词，不构建完整语法树；超大文件可以设置 `:highlight="false"` 以降低开销。
- 复制优先使用 `navigator.clipboard`，非安全上下文会回退到 `document.execCommand('copy')`。
- 等宽字体优先使用本机已安装的 JetBrains Mono、Fira Code、Cascadia Code 等编程字体，未安装时回退到系统等宽字体；不加载任何远程字体文件。
- 颜色取自 `--bili-code-*` 设计令牌，亮/暗主题自动适配，也可以按需覆盖。
