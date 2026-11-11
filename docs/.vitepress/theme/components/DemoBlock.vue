<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { createApp, type App } from 'vue'
import * as VueRuntime from 'vue'
import BiliUI, * as BiliExports from 'bili-ui'

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
const editing = ref(false)
const draft = ref('')
const running = ref(false)
const error = ref('')
const live = ref(false)
const liveRef = ref<HTMLElement | null>(null)
const shared = ref(false)
const rootRef = ref<HTMLElement | null>(null)
let demoIndex = 0

let liveApp: App | null = null
let styleElement: HTMLStyleElement | null = null
let demoId = 0
let copyTimer: ReturnType<typeof setTimeout> | null = null

const lines = computed(() => (props.code ? props.code.trimEnd().split('\n').length : 0))

const destroyLive = () => {
  if (liveApp) {
    liveApp.unmount()
    liveApp = null
  }
  live.value = false
  if (liveRef.value) liveRef.value.innerHTML = ''
  styleElement?.remove()
  styleElement = null
}

const beginEdit = () => {
  draft.value = props.code ?? ''
  editing.value = true
  error.value = ''
}

const cancelEdit = () => {
  destroyLive()
  editing.value = false
  error.value = ''
}

const resetDraft = () => {
  draft.value = props.code ?? ''
  error.value = ''
  destroyLive()
}

const encodeDemo = (value: string) => {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach(byte => (binary += String.fromCharCode(byte)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const decodeDemo = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

const shareDemo = async () => {
  if (typeof window === 'undefined') return
  const source = editing.value ? draft.value : props.code ?? ''
  const url = new URL(window.location.href)
  url.searchParams.set('demo', encodeDemo(`${demoIndex}:${source}`))
  try {
    await copyText(url.toString())
    shared.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      shared.value = false
      copyTimer = null
    }, 1800)
  } catch {
    error.value = '复制失败，请检查浏览器剪贴板权限'
  }
}

onMounted(() => {
  if (rootRef.value) {
    const blocks = [...document.querySelectorAll('.demo-block')]
    demoIndex = Math.max(0, blocks.indexOf(rootRef.value))
  }

  const value = new URLSearchParams(window.location.search).get('demo')
  if (!value) return
  try {
    const decoded = decodeDemo(value)
    const separator = decoded.indexOf(':')
    if (separator === -1) return
    const index = Number(decoded.slice(0, separator))
    if (index !== demoIndex) return
    draft.value = decoded.slice(separator + 1)
    editing.value = true
    expanded.value = true
  } catch {
    // Ignore malformed shared links.
  }
})

const formatTypeImports = (source: string) =>
  source.replace(/import\s+type\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?/g, '')

const convertImports = (source: string) => {
  const toBinding = (names: string) => names.replace(/\bas\b/g, ':')
  let code = formatTypeImports(source)
  code = code.replace(
    /import\s*\{([\s\S]*?)\}\s*from\s*['"]vue['"];?/g,
    (_, names: string) => `const { ${toBinding(names)} } = __VUE__;`
  )
  code = code.replace(
    /import\s*\{([\s\S]*?)\}\s*from\s*['"]bili-ui['"];?/g,
    (_, names: string) => `const { ${toBinding(names)} } = __BILI__;`
  )
  return code
}

const compileExample = async (source: string) => {
  const [{ parse, compileScript, compileTemplate, compileStyle }, { transform }] =
    await Promise.all([import('@vue/compiler-sfc'), import('sucrase')])

  const id = `demo-${++demoId}`
  const filename = 'InlineExample.vue'
  const { descriptor, errors } = parse(source, { filename })
  if (errors.length) throw new Error(errors[0].message)

  let code: string
  if (descriptor.script || descriptor.scriptSetup) {
    const compiled = compileScript(descriptor, { id, inlineTemplate: true })
    code = compiled.content
  } else if (descriptor.template) {
    const compiled = compileTemplate({
      source: descriptor.template.content,
      filename,
      id,
      scoped: descriptor.styles.some(style => style.scoped)
    })
    if (compiled.errors.length) throw new Error(String(compiled.errors[0]))
    code = compiled.code.replace(/export\s+function\s+render/, 'function render')
    code += '\nconst __component = { render }; return __component;'
  } else {
    throw new Error('示例缺少模板')
  }

  code = convertImports(code)
  if (/^\s*import\s/m.test(code)) {
    throw new Error('在线运行暂不支持相对模块导入')
  }

  code = transform(code, { transforms: ['typescript'] }).code
  code = code.replace(/export\s+default\s+/, 'return ')

  const component = new Function('__VUE__', '__BILI__', code)(VueRuntime, BiliExports)
  if (!component) throw new Error('示例没有默认导出组件')

  const scoped = descriptor.styles.some(style => style.scoped)
  if (scoped) component.__scopeId = `data-v-${id}`

  const css = descriptor.styles
    .map(style =>
      compileStyle({
        source: style.content,
        filename,
        id,
        scoped: style.scoped
      })
    )
    .map(result => {
      if (result.errors.length) throw new Error(String(result.errors[0]))
      return result.code
    })
    .join('\n')

  return { component, css }
}

const run = async () => {
  running.value = true
  error.value = ''
  try {
    const { component, css } = await compileExample(draft.value)
    destroyLive()
    live.value = true
    await nextTick()
    if (!liveRef.value) throw new Error('预览容器不可用')

    liveApp = createApp(component)
    liveApp.use(BiliUI)
    liveApp.mount(liveRef.value)

    if (css) {
      styleElement = document.createElement('style')
      styleElement.setAttribute('data-demo-style', 'true')
      styleElement.textContent = css
      document.head.appendChild(styleElement)
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    running.value = false
  }
}

onBeforeUnmount(() => {
  destroyLive()
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div ref="rootRef" class="demo-block">
    <div v-if="title" class="demo-block__title">{{ title }}</div>
    <div class="demo-block__preview">
      <div v-if="live" ref="liveRef" class="demo-block__live" />
      <slot v-else />
    </div>
    <div class="demo-block__toolbar">
      <span v-if="code" class="demo-block__meta">{{ lines }} 行</span>
      <button v-if="code" class="demo-block__button" type="button" @click="beginEdit">
        编辑示例
      </button>
      <button v-if="code" class="demo-block__button" type="button" @click="shareDemo">
        {{ shared ? '已复制链接' : '分享' }}
      </button>
      <button class="demo-block__button" type="button" @click="expanded = !expanded">
        {{ expanded ? '收起代码' : '查看代码' }}
      </button>
    </div>

    <div v-if="editing" class="demo-block__editor">
      <textarea
        v-model="draft"
        class="demo-block__textarea"
        spellcheck="false"
        aria-label="编辑示例代码"
      />
      <div class="demo-block__editor-actions">
        <span v-if="error" class="demo-block__error">{{ error }}</span>
        <span v-else class="demo-block__editor-hint">
          支持单文件 Vue 示例，可导入 vue / bili-ui
        </span>
        <button class="demo-block__button" type="button" @click="resetDraft">重置</button>
        <button class="demo-block__button" type="button" @click="cancelEdit">取消</button>
        <button class="demo-block__run" type="button" :disabled="running" @click="run">
          {{ running ? '运行中…' : '运行' }}
        </button>
      </div>
    </div>

    <div v-else v-show="expanded" class="demo-block__code">
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

.demo-block__live {
  width: 100%;
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

.demo-block__editor {
  padding: 0 14px 14px;
}

.demo-block__textarea {
  display: block;
  width: 100%;
  min-height: 320px;
  padding: 12px 14px;
  font-family: var(--bili-font-family-mono, monospace);
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  resize: vertical;
  background: var(--vp-code-block-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  outline: none;
  tab-size: 2;
}

.demo-block__textarea:focus {
  border-color: var(--vp-c-brand-1);
}

.demo-block__editor-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding-top: 10px;
}

.demo-block__editor-hint {
  margin-right: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.demo-block__error {
  flex: 1;
  min-width: 200px;
  font-family: var(--bili-font-family-mono, monospace);
  font-size: 12px;
  color: var(--vp-c-danger-1);
  overflow-wrap: anywhere;
}

.demo-block__run {
  padding: 4px 14px;
  font-family: inherit;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  background: var(--vp-c-brand-1);
  border: 0;
  border-radius: 6px;
}

.demo-block__run:disabled {
  cursor: wait;
  opacity: 0.6;
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
