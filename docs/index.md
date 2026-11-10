---
layout: home

hero:
  name: Bili UI
  text: Vue 3 PC 组件库
  tagline: 为桌面端而生的高质量组件库，开箱即用的设计令牌与亮暗双主题
  image:
    src: /logo.svg
    alt: Bili UI
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 浏览组件
      link: /components/button

features:
  - icon: 🧩
    title: 51 个核心组件
    details: 覆盖基础、表单、反馈与数据展示，满足中后台产品的主要搭建场景。
  - icon: 🎨
    title: 三层设计令牌
    details: SCSS 原始值 → 语义 CSS 变量 → 组件变量，支持运行时换肤与精细化定制。
  - icon: 🌗
    title: 亮暗双主题
    details: 通过 html.dark 一键切换，所有组件内置暗色语义适配。
  - icon: 🛡️
    title: TypeScript 友好
    details: 组件 Props、事件与插槽均有完整类型推导，构建产物附带声明文件。
  - icon: ⚡
    title: 可摇树的 ESM
    details: 提供 ESM / CJS 双格式产物，支持全量安装与具名引入两种使用方式。
  - icon: 📚
    title: 文档与测试
    details: 每个组件都有可交互文档、完整 API 表格与核心行为单元测试。
---

## 快速预览

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <BiliSpace>
    <BiliInput v-model="value" placeholder="请输入内容" clearable />
    <BiliButton type="primary">搜索</BiliButton>
  </BiliSpace>
</template>
```

更多能力请从 [快速开始](/guide/quickstart) 进入，或直接浏览 [组件总览](/components/button)。
