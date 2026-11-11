---
title: API 参考
---

# API 参考（自动生成）

本页由 `vue-component-meta` 在文档构建时扫描组件源码生成，包含所有对外组件的 Props、Events、Slots 与 Exposes，避免手写 API 表与类型定义不一致。

<script setup>
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

<ApiReference />

## 在组件页内嵌

组件文档页可以按组件名内嵌同一份数据：

```vue
<script setup>
import ApiReference from '../.vitepress/theme/components/ApiReference.vue'
</script>

<ApiReference name="BiliButton" />
```

不传 `name` 时渲染完整的可搜索 API 参考。

## 说明

- 数据来源：`packages/bili-ui/src/components/**/*.vue` 的类型定义与 `defineProps` / `defineEmits` / `defineExpose`。
- JSDoc 注释会作为说明展示；没有注释的属性显示 `—`。
- 组件文档页中的 API 表用于补充中文说明与业务示例，本页是类型层的完整参考。
- 生成脚本：`docs/scripts/generate-api.mjs`，在 `pnpm dev` / `pnpm docs:build` 前自动执行。
