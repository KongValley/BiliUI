<script setup lang="ts">
import { ref } from 'vue'

const text = ref('双击编辑这段文字')
const copied = ref('')

const handleChange = (value: string) => {
  text.value = value
}

const handleCopy = (value: string) => {
  copied.value = value
}
</script>

<template>
  <BiliSpace direction="vertical" size="lg">
    <BiliSpace :size="24" align="center">
      <BiliText copyable @copy="handleCopy">{{ text }}</BiliText>
      <span v-if="copied" class="hint">已复制：{{ copied }}</span>
    </BiliSpace>

    <BiliTitle :level="3" editable @change="handleChange">{{ text }}</BiliTitle>

    <BiliParagraph copyable editable @change="handleChange">
      段落同样支持复制与编辑，编辑后按 Enter 提交，Esc 取消。
    </BiliParagraph>
  </BiliSpace>
</template>

<style scoped>
.hint {
  font-size: 12px;
  color: var(--bili-color-success);
}
</style>
