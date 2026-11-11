<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import BiliIcon from '../../icon/src/icon.vue'
import type { TypographyCopyable } from './typography'

defineOptions({ name: 'BiliTypographyContent' })

const props = defineProps<{
  copyable?: boolean | TypographyCopyable
  editable?: boolean
}>()

const emit = defineEmits<{
  copy: [text: string]
  change: [value: string]
  'edit-start': []
  'edit-cancel': []
}>()

const ns = useNamespace('typography')
const locale = useLocale()
const contentRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const copied = ref(false)
const editing = ref(false)
const editingValue = ref('')
let copyTimer: ReturnType<typeof setTimeout> | null = null

const currentText = (): string => {
  if (typeof props.copyable === 'object' && props.copyable?.text !== undefined) {
    return props.copyable.text
  }
  return contentRef.value?.textContent ?? ''
}

const fallbackCopy = (text: string) => {
  if (typeof document === 'undefined') return
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand?.('copy')
  } finally {
    textarea.remove()
  }
}

const copy = async () => {
  const text = currentText()
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
    else fallbackCopy(text)
  } catch {
    fallbackCopy(text)
  }

  copied.value = true
  emit('copy', text)
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
  }, 1500)
}

const startEdit = () => {
  if (editing.value) return
  editingValue.value = currentText()
  editing.value = true
  emit('edit-start')
  void nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

const confirmEdit = () => {
  if (!editing.value) return
  editing.value = false
  emit('change', editingValue.value)
}

const cancelEdit = () => {
  if (!editing.value) return
  editing.value = false
  emit('edit-cancel')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    confirmEdit()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    cancelEdit()
  }
}

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
})

const inputStyle = computed(() => ({ minWidth: `${Math.max(2, editingValue.value.length)}ch` }))
</script>

<template>
  <span :class="ns.b()">
    <input
      v-if="editing"
      ref="inputRef"
      v-model="editingValue"
      :class="ns.e('edit')"
      :style="inputStyle"
      :aria-label="locale.edit"
      @keydown="handleKeydown"
      @blur="confirmEdit"
    />
    <span v-else ref="contentRef" :class="ns.e('content')">
      <slot />
    </span>

    <span :class="ns.e('actions')">
      <template v-if="editing">
        <button
          :class="ns.e('action')"
          type="button"
          :aria-label="locale.confirm"
          @mousedown.prevent
          @click.stop.prevent="confirmEdit"
        >
          <BiliIcon name="check" :size="14" />
        </button>
        <button
          :class="ns.e('action')"
          type="button"
          :aria-label="locale.cancel"
          @mousedown.prevent
          @click.stop.prevent="cancelEdit"
        >
          <BiliIcon name="close" :size="14" />
        </button>
      </template>

      <template v-else>
        <button
          v-if="copyable"
          :class="ns.e('action')"
          type="button"
          :aria-label="copied ? locale.copied : locale.copy"
          @mousedown.prevent
          @click.stop.prevent="copy"
        >
          <BiliIcon :name="copied ? 'check' : 'copy'" :size="14" />
        </button>
        <button
          v-if="editable"
          :class="ns.e('action')"
          type="button"
          :aria-label="locale.edit"
          @mousedown.prevent
          @click.stop.prevent="startEdit"
        >
          <BiliIcon name="edit" :size="14" />
        </button>
      </template>
    </span>
  </span>
</template>
