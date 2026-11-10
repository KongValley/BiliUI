<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    code?: string
    title?: string
    /** Language hint forwarded to the code block's highlighter. */
    language?: string
  }>(),
  { language: 'vue' }
)

const expanded = ref(false)

const lines = computed(() => (props.code ? props.code.trimEnd().split('\n').length : 0))
</script>

<template>
  <div class="demo-block">
    <div v-if="title" class="demo-block__title">{{ title }}</div>
    <div class="demo-block__preview">
      <slot />
    </div>
    <div class="demo-block__toolbar">
      <span v-if="code" class="demo-block__meta">{{ lines }} 行</span>
      <button class="demo-block__button" type="button" @click="expanded = !expanded">
        {{ expanded ? '收起代码' : '查看代码' }}
      </button>
    </div>
    <div v-show="expanded" class="demo-block__code">
      <BiliCodeBlock
        :code="code ?? ''"
        :language="language"
        :max-height="440"
        show-line-numbers
        wrap
      />
    </div>
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
  min-height: 80px;
  padding: 24px;
}

.demo-block__toolbar {
  display: flex;
  flex-shrink: 0;
  gap: 14px;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 14px;
}

.demo-block__meta {
  margin-right: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
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
  padding: 0 12px 12px;
}

/* The host docs styles target `pre`/`ul` broadly; reset what leaks in. */
.demo-block__code :deep(.bili-code-block) {
  background: var(--vp-code-block-bg);
}

.demo-block__code :deep(.bili-code-block__pre) {
  margin: 0;
  background: transparent;
  border-radius: 0;
}

.demo-block__code :deep(.bili-code-block__code) {
  padding: 10px 0;
  font-size: 12.5px;
}
</style>
