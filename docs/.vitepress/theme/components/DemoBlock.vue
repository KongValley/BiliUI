<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  code?: string
  title?: string
}>()

const expanded = ref(false)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const copy = async () => {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="demo-block">
    <div v-if="title" class="demo-block__title">{{ title }}</div>
    <div class="demo-block__preview">
      <slot />
    </div>
    <div class="demo-block__toolbar">
      <button class="demo-block__button" type="button" @click="expanded = !expanded">
        {{ expanded ? '收起代码' : '查看代码' }}
      </button>
      <button class="demo-block__button" type="button" @click="copy">
        {{ copied ? '已复制' : '复制代码' }}
      </button>
    </div>
    <pre v-show="expanded" class="demo-block__code"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.demo-block {
  margin: 16px 0 28px;
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}

.demo-block__title {
  padding: 14px 20px 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.demo-block__preview {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 24px;
  min-height: 80px;
}

.demo-block__toolbar {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 8px 14px;
  background: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-divider);
}

.demo-block__button {
  padding: 0;
  font-family: inherit;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  background: transparent;
  border: 0;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.demo-block__button:hover {
  opacity: 1;
  text-decoration: underline;
}

.demo-block__code {
  max-height: 440px;
  padding: 16px 20px;
  margin: 0;
  overflow: auto;
  font-family: var(--bili-font-family-mono);
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--vp-code-block-color, var(--vp-c-text-1));
  background: var(--vp-code-block-bg);
}

.demo-block__code code {
  font-family: inherit;
}
</style>
