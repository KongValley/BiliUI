<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig, useLocale } from '../../../hooks/use-config'
import BiliIcon from '../../icon/src/icon.vue'
import { useFormItem } from '../../form/src/types'
import { inputTagProps } from './input-tag'

defineOptions({ name: 'BiliInputTag' })

const props = defineProps(inputTagProps)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
  add: [value: string]
  remove: [value: string, index: number]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('input-tag')
const locale = useLocale()
const config = useConfig()
const mergedSize = computed(() => props.size ?? config.value.size)
const formItem = useFormItem()

const inputRef = ref<HTMLInputElement | null>(null)
const draft = ref('')
const focused = ref(false)
const composing = ref(false)

const tags = computed(() => props.modelValue ?? [])
const hasTags = computed(() => tags.value.length > 0)
const showPlaceholder = computed(() => !hasTags.value && !draft.value)
const displayPlaceholder = computed(
  () => props.placeholder || locale.value.inputTagPlaceholder
)
const showClear = computed(() => props.clearable && hasTags.value && !props.disabled)
const delimiterList = computed(() => {
  const value = props.delimiter
  return Array.isArray(value) ? value : [...value]
})

const isReachedMax = computed(() => props.max > 0 && tags.value.length >= props.max)

const commit = (value: string[]) => {
  emit('update:modelValue', value)
  emit('change', value)
  formItem?.validate('change')
}

const normalize = (raw: string): string => {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  return props.maxlength ? trimmed.slice(0, props.maxlength) : trimmed
}

const appendTag = (raw: string) => {
  const tag = normalize(raw)
  if (!tag || isReachedMax.value) return
  if (!props.allowDuplicate && tags.value.includes(tag)) return

  commit([...tags.value, tag])
  emit('add', tag)
}

const addFromDraft = () => {
  if (!draft.value.trim()) return false
  appendTag(draft.value)
  draft.value = ''
  return true
}

const splitDraft = (raw: string): string => {
  let rest = raw
  delimiterList.value.forEach(delimiter => {
    if (!delimiter) return
    const parts = rest.split(delimiter)
    if (parts.length > 1) {
      parts.slice(0, -1).forEach(part => appendTag(part))
      rest = parts[parts.length - 1]
    }
  })
  return rest
}

const handleInput = (event: Event) => {
  const raw = (event.target as HTMLInputElement).value
  if (composing.value) {
    draft.value = raw
    return
  }
  draft.value = splitDraft(raw)
  if (draft.value !== raw) {
    ;(event.target as HTMLInputElement).value = draft.value
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (composing.value) return

  if (event.key === 'Backspace' && !draft.value && hasTags.value) {
    event.preventDefault()
    removeTag(tags.value.length - 1)
    return
  }

  const isCommitKey =
    (props.trigger === 'Enter' && event.key === 'Enter') ||
    (props.trigger === 'Space' && event.key === ' ')

  if (isCommitKey) {
    event.preventDefault()
    addFromDraft()
    return
  }

  if (delimiterList.value.includes(event.key)) {
    event.preventDefault()
    addFromDraft()
  }
}

const removeTag = (index: number) => {
  if (props.disabled || props.readonly) return
  const removed = tags.value[index]
  commit(tags.value.filter((_, tagIndex) => tagIndex !== index))
  emit('remove', removed, index)
  nextTick(() => inputRef.value?.focus())
}

const clear = () => {
  commit([])
  draft.value = ''
  emit('clear')
  nextTick(() => inputRef.value?.focus())
}

const focus = () => inputRef.value?.focus()
const blur = () => inputRef.value?.blur()

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  if (props.addOnBlur) addFromDraft()
  emit('blur', event)
  formItem?.validate('blur')
}

const handleCompositionStart = () => {
  composing.value = true
}

const handleCompositionEnd = (event: CompositionEvent) => {
  composing.value = false
  draft.value = splitDraft((event.target as HTMLInputElement).value)
}

const handleRootClick = () => {
  if (props.disabled) return
  focus()
}

defineExpose({ focus, blur, inputRef })
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(mergedSize),
      ns.is('focused', focused),
      ns.is('disabled', disabled),
      ns.is('readonly', readonly)
    ]"
    role="group"
    @click="handleRootClick"
  >
    <span v-for="(tag, index) in tags" :key="`${tag}-${index}`" :class="ns.e('tag')">
      <span :class="ns.e('tag-text')">{{ tag }}</span>
      <button
        v-if="!disabled && !readonly"
        :class="ns.e('tag-close')"
        type="button"
        tabindex="-1"
        :aria-label="locale.remove"
        @click.stop="removeTag(index)"
      >
        <BiliIcon name="close" :size="10" />
      </button>
    </span>

    <input
      ref="inputRef"
      :class="ns.e('input')"
      :value="draft"
      :placeholder="showPlaceholder ? displayPlaceholder : ''"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="displayPlaceholder"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    />

    <button
      v-if="showClear"
      :class="ns.e('clear')"
      type="button"
      tabindex="-1"
      :aria-label="locale.clear"
      @click.stop="clear"
    >
      <BiliIcon name="close-circle" />
    </button>
  </div>
</template>
