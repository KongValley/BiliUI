<script setup lang="ts">
import { computed, nextTick, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useZIndex } from '../../../hooks/use-z-index'
import {
  mentionProps,
  type NormalizedMentionOption
} from './mention'

defineOptions({ name: 'BiliMention' })

const props = defineProps(mentionProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  select: [option: NormalizedMentionOption]
  search: [query: string]
  'visible-change': [visible: boolean]
}>()

const ns = useNamespace('mention')
const locale = useLocale()
const { nextZIndex, currentZIndex } = useZIndex()

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(0)
const replaceStart = ref(-1)

const displayPlaceholder = computed(
  () => props.placeholder || locale.value.searchPlaceholder
)
const displayEmpty = computed(() => props.emptyText || locale.value.empty)

const normalizedOptions = computed<NormalizedMentionOption[]>(() =>
  props.options.map(option => ({
    label: option.label,
    value: option.value,
    disabled: !!option.disabled
  }))
)

const filteredOptions = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return normalizedOptions.value.filter(
    option =>
      !keyword ||
      option.label.toLowerCase().includes(keyword) ||
      String(option.value).toLowerCase().includes(keyword)
  )
})

const { floatingStyles, isPositioned } = useFloating(rootRef, panelRef, {
  placement: 'bottom-start',
  offset: 4
})

const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  width: `${props.width}px`,
  zIndex: props.zIndex ?? currentZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  nextZIndex()
  emit('visible-change', true)
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  query.value = ''
  replaceStart.value = -1
  activeIndex.value = 0
  emit('visible-change', false)
}

const firstEnabled = () => {
  const index = filteredOptions.value.findIndex(option => !option.disabled)
  activeIndex.value = index === -1 ? 0 : index
}

const resolveQuery = (value: string, caret: number) => {
  const prefix = props.prefix
  if (!prefix) {
    close()
    return
  }
  const before = value.slice(0, caret)
  const start = before.lastIndexOf(prefix)
  if (start === -1) {
    close()
    return
  }

  const text = before.slice(start + prefix.length)
  if (/\s/.test(text)) {
    close()
    return
  }

  replaceStart.value = start
  query.value = text
  firstEnabled()
  open()
  emit('search', text)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', target.value)
  resolveQuery(target.value, target.selectionStart ?? target.value.length)
}

const select = (option: NormalizedMentionOption) => {
  if (option.disabled) return
  const textarea = textareaRef.value
  const current = textarea?.value ?? props.modelValue
  const caret = textarea?.selectionStart ?? current.length
  const start = replaceStart.value >= 0 ? replaceStart.value : caret
  const inserted = `${props.prefix}${option.label}${props.split}`
  const next = `${current.slice(0, start)}${inserted}${current.slice(caret)}`

  emit('update:modelValue', next)
  emit('input', next)
  emit('select', option)
  close()

  nextTick(() => {
    const node = textareaRef.value
    if (!node) return
    node.focus()
    const position = start + inserted.length
    node.setSelectionRange(position, position)
  })
}

const moveActive = (delta: number) => {
  const enabled = filteredOptions.value
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => !option.disabled)
  if (!enabled.length) return
  const current = enabled.findIndex(({ index }) => index === activeIndex.value)
  const next = (current + delta + enabled.length) % enabled.length
  activeIndex.value = enabled[next].index
  nextTick(() => {
    panelRef.value
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex.value}"]`)
      ?.scrollIntoView?.({ block: 'nearest' })
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' && isOpen.value) {
    event.preventDefault()
    moveActive(1)
  } else if (event.key === 'ArrowUp' && isOpen.value) {
    event.preventDefault()
    moveActive(-1)
  } else if (event.key === 'Enter' && isOpen.value) {
    const option = filteredOptions.value[activeIndex.value]
    if (option) {
      event.preventDefault()
      select(option)
    }
  } else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    close()
  } else if (event.key === 'Tab') {
    close()
  }
}

watch(
  () => props.disabled,
  disabled => {
    if (disabled) close()
  }
)

useClickOutside([rootRef, panelRef], close)

defineExpose({ focus: () => textareaRef.value?.focus(), close })
</script>

<template>
  <div
    ref="rootRef"
    :class="[ns.b(), ns.is('disabled', disabled), ns.is('open', isOpen)]"
  >
    <textarea
      ref="textareaRef"
      :class="ns.e('textarea')"
      :value="modelValue"
      :rows="rows"
      :placeholder="displayPlaceholder"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-autocomplete="list"
      @input="handleInput"
      @keydown="handleKeydown"
    />

    <Teleport to="body">
      <Transition :name="ns.transition('mention-dropdown')">
        <div
          v-if="isOpen"
          ref="panelRef"
          :class="[ns.e('panel'), popperClass]"
          :style="panelStyles"
          role="listbox"
        >
          <button
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            :class="[ns.e('option'), ns.is('active', index === activeIndex)]"
            :data-index="index"
            type="button"
            role="option"
            :aria-selected="index === activeIndex"
            :disabled="option.disabled"
            @mousedown.prevent
            @click="select(option)"
          >
            {{ option.label }}
          </button>

          <div v-if="!filteredOptions.length" :class="ns.e('empty')">{{ displayEmpty }}</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
