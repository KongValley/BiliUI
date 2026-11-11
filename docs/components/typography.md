---
title: Typography 排版
---

# Typography 排版

提供标题、正文、文本样式与链接四类排版组件，统一字号、行高与语义色。

<script setup>
import DemoBasic from '../examples/typography/basic.vue'
import basicCode from '../examples/typography/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

组合 `Title`、`Paragraph`、`Text` 与 `Link` 构建内容层级。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

### Text

<ApiReference name="BiliText" />

### Title

<ApiReference name="BiliTitle" />

### Paragraph

<ApiReference name="BiliParagraph" />

### Link

<ApiReference name="BiliLink" />

## 说明

- `Text` 支持加粗、斜体、下划线、删除线、高亮、行内代码与省略。
- `Title` 支持 1–5 级标题，自动渲染对应 `h1`–`h5`。
- `Link` 为 `target="_blank"` 时自动补 `rel="noopener noreferrer"`。
- 全部组件继承当前主题色与语义色。
