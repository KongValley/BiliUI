<script setup lang="ts">
const jsonCode = `{
  "name": "bili-ui",
  "version": "0.1.0",
  "components": [
    "Button",
    "Input",
    "Select",
    "Table",
    "Chart",
    "CodeBlock"
  ],
  "keywords": ["vue3", "typescript", "scss", "vite"],
  "license": "MIT"
}`

const cssCode = `.bili-code-block {
  background-image: linear-gradient(135deg, rgba(224, 53, 107, 0.12), rgba(79, 124, 255, 0.12) 55%, transparent);
}`
</script>

<template>
  <BiliSpace direction="vertical" size="lg" fill>
    <BiliCodeBlock
      :code="jsonCode"
      language="json"
      title="package.json"
      :max-height="160"
      show-line-numbers
    />
    <BiliCodeBlock :code="cssCode" language="scss" wrap :show-header="false" />
  </BiliSpace>
</template>
