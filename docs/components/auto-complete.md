---
title: AutoComplete 自动补全
---

# AutoComplete 自动补全

输入时给出候选建议，支持本地过滤、异步获取、键盘选择与空状态。

<script setup>
import DemoBasic from '../examples/auto-complete/basic.vue'
import basicCode from '../examples/auto-complete/basic.vue?raw'
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

## 基础用法

传入 `options` 时按输入内容本地过滤；传入 `fetch-suggestions` 时从远端获取建议。

<DemoBlock :code="basicCode">
  <DemoBasic />
</DemoBlock>

## API

<ApiReference name="BiliAutoComplete" />

## 说明

- 输入防抖由 `debounce` 控制，异步请求会丢弃过期结果。
- `↑` / `↓` 切换候选，`Enter` 选中，`Esc` 关闭。
- 支持 `clearable`、空状态文案与 `popper-class` 定制浮层。
- 受控值通过 `v-model` 绑定，选中时同时触发 `select`。
