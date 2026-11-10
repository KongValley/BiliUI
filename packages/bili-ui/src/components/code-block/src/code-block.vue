<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { addUnit } from '../../../utils/dom'
import BiliIcon from '../../icon/src/icon.vue'
import { codeBlockProps } from './code-block'
import { languageLabel, tokenize, type CodeToken } from './highlight'

defineOptions({ name: 'BiliCodeBlock' })

const props = defineProps(codeBlockProps)

const emit = defineEmits<{
  copy: [code: string]
}>()

const ns = useNamespace('code-block')
const locale = useLocale()

const lines = computed<CodeToken[][]>(() => {
  if (props.highlight) return tokenize(props.code, props.language)
  return props.code.split('\n').map(line => (line ? [{ text: line, type: 'plain' }] : []))
})

const label = computed(() => languageLabel(props.language))

const gutter = computed(() => `${Math.max(2, String(lines.value.length).length) + 1}ch`)

const rootStyle = computed(
  () => ({ [ns.cssVar('gutter')]: gutter.value }) as CSSProperties
)

const bodyStyle = computed<CSSProperties | undefined>(() =>
  props.maxHeight ? { maxHeight: addUnit(props.maxHeight) } : undefined
)

// ---------------------------------------------------------------- copy state

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const stopCopyTimer = () => {
  if (copyTimer) {
    clearTimeout(copyTimer)
    copyTimer = null
  }
}

const legacyCopy = (): boolean => {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
    return false
  }

  const textarea = document.createElement('textarea')
  textarea.value = props.code
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    // Unsupported in some environments; keep `ok` false.
  }

  document.body.removeChild(textarea)
  return ok
}

const copy = async () => {
  if (!props.code) return

  let ok = false

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(props.code)
      ok = true
    } catch {
      // Clipboard permission can be denied; fall through to the legacy path.
    }
  }

  if (!ok) ok = legacyCopy()
  if (!ok) return

  copied.value = true
  emit('copy', props.code)
  stopCopyTimer()
  copyTimer = setTimeout(() => {
    copied.value = false
    copyTimer = null
  }, 1600)
}

onBeforeUnmount(stopCopyTimer)

defineExpose({ copy })
</script>

<template>
  <div :class="ns.b()" :style="rootStyle">
    <div v-if="showHeader" :class="ns.e('header')">
      <div :class="ns.e('heading')">
        <span v-if="title" :class="ns.e('title')" :title="title">{{ title }}</span>
        <span :class="ns.e('language')">{{ label }}</span>
      </div>
      <div :class="ns.e('actions')">
        <slot name="actions" />
        <button
          v-if="copyable"
          type="button"
          :class="[ns.e('copy'), ns.is('copied', copied)]"
          :aria-label="copied ? locale.copied : locale.copyCode"
          @click="copy"
        >
          <BiliIcon :name="copied ? 'check' : 'copy'" :size="14" />
          <span>{{ copied ? locale.copied : locale.copy }}</span>
        </button>
      </div>
    </div>

    <pre :class="[ns.e('pre'), ns.is('wrap', wrap)]" :style="bodyStyle"><code
      :class="ns.e('code')"
    ><span
      v-for="(line, lineIndex) in lines"
      :key="lineIndex"
      :class="ns.e('line')"
    ><span
      v-if="showLineNumbers"
      :class="ns.e('line-number')"
      aria-hidden="true"
    >{{ lineIndex + 1 }}</span><span :class="ns.e('line-content')"><span
      v-for="(token, tokenIndex) in line"
      :key="tokenIndex"
      :class="[ns.e('token'), `${ns.e('token')}--${token.type}`]"
    >{{ token.text }}</span></span></span></code></pre>
  </div>
</template>
