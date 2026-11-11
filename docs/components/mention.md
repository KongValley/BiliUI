---
title: Mention 提及
---

# Mention 提及

在文本域中输入 `@` 唤起成员候选，选中后自动插入提及文本。

<script setup>
import DemoBasic from '../examples/mention/basic.vue'
import basicCode from '../examples/mention/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

`prefix` 控制触发字符，`options` 提供候选成员；输入 `@` 后继续输入即可过滤。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

<ApiReference name="BiliMention" />

## 说明

- 根据光标位置解析当前提及词，空格会结束查询。
- `↑` / `↓` 切换候选，`Enter` 插入，`Esc` 关闭。
- 插入内容格式为 `prefix + label + split`，默认末尾追加空格。
- 支持自定义 `prefix`、候选宽度与浮层类名。
