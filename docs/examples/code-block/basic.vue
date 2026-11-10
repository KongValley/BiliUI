<script setup lang="ts">
const vueCode = `<template>
  <div class="publish">
    <BiliButton type="primary">发布</BiliButton>
    <BiliTag type="success" round>v1.0</BiliTag>
  </div>
</template>`

const tsCode = `interface User {
  name: string
  age: number
}

export function greet(user: User): string {
  // 关键字、字符串、注释都会高亮
  return 'Hello, ' + user.name
}`
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliCodeBlock :code="vueCode" language="vue" title="Publish.vue" show-line-numbers />
    <BiliCodeBlock :code="tsCode" language="ts" title="greet.ts" />
  </BiliSpace>
</template>
