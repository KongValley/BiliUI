<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig, useLocale } from '../../../hooks/use-config'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useZIndex } from '../../../hooks/use-z-index'
import BiliIcon from '../../icon/src/icon.vue'
import BiliInput from '../../input/src/input.vue'
import {
  autoCompleteProps,
  type AutoCompleteOption,
  type NormalizedAutoCompleteOption
} from './auto-complete'

defineOptions({ name: 'BiliAutoComplete' })

const props = defineProps(autoCompleteProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  select: [option: NormalizedAutoCompleteOption]
  'visible-change': [visible: boolean]
  clear: []
}>()

const ns = useNamespace('auto-complete')
const locale = useLocale()
const config = useConfig()
const { nextZIndex, currentZIndex } = useZIndex()

const mergedSize = computed(() => props.size ?? config.value.size)
const displayPlaceholder = computed(
  () => props.placeholder || locale.value.searchPlaceholder
)
const displayEmpty = computed(() => props.emptyText || locale.value.empty)

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const inputRef = ref<InstanceType<typeof BiliInput> | null>(null)
const isOpen = ref(false)
const loading = ref(false)
const triggerWidth = ref(0)
const activeIndex = ref(-1)
const suggestions = ref<NormalizedAutoCompleteOption[]>([])

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  offset: 6
})

const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  minWidth: `${triggerWidth.value}px`,
  zIndex: props.zIndex ?? currentZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const normalize = (option: AutoCompleteOption): NormalizedAutoCompleteOption => {
  if (typeof option === 'string') return { label: option, value: option, disabled: false }
  return { label: option.label, value: option.value, disabled: !!option.disabled }
}

const filterLocal = (query: string) => {
  const keyword = query.trim().toLowerCase()
  return props.options
    .map(normalize)
    .filter(option => !keyword || option.label.toLowerCase().includes(keyword))
}

let requestToken = 0

const runFetch = async (query: string) => {
  const token = ++requestToken
  if (!props.fetchSuggestions) {
    suggestions.value = filterLocal(query)
    activeIndex.value = suggestions.value.findIndex(option => !option.disabled)
    return
  }

  loading.value = true
  try {
    const result = await props.fetchSuggestions(query)
    if (token !== requestToken) return
    suggestions.value = (result ?? []).map(normalize)
    activeIndex.value = suggestions.value.findIndex(option => !option.disabled)
  } catch {
    if (token === requestToken) {
      suggestions.value = []
      activeIndex.value = -1
    }
  } finally {
    if (token === requestToken) loading.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const scheduleFetch = (query: string) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void runFetch(query)
  }, Math.max(0, props.debounce))
}

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  nextZIndex()
  triggerWidth.value = triggerRef.value?.getBoundingClientRect().width ?? 0
  emit('visible-change', true)
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  activeIndex.value = -1
  emit('visible-change', false)
}

const handleInput = (value: string) => {
  emit('update:modelValue', value)
  emit('input', value)
  if (!props.disabled) {
    open()
    scheduleFetch(value)
  }
}

const handleFocus = () => {
  if (props.disabled) return
  open()
  if (props.triggerOnFocus) {
    if (debounceTimer) clearTimeout(debounceTimer)
    void runFetch(props.modelValue)
  }
}

const scheduleClose = () => {
  setTimeout(close, 120)
}

const select = (option: NormalizedAutoCompleteOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  emit('select', option)
  close()
  inputRef.value?.focus()
}

const moveActive = (delta: number) => {
  if (!suggestions.value.length) return
  const enabled = suggestions.value
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
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!isOpen.value) open()
    moveActive(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
  } else if (event.key === 'Enter') {
    const option = suggestions.value[activeIndex.value]
    if (option) {
      event.preventDefault()
      select(option)
    }
  } else if (event.key === 'Escape') {
    if (isOpen.value) {
      event.preventDefault()
      close()
    }
  } else if (event.key === 'Tab') {
    close()
  }
}

const handleClear = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  suggestions.value = []
  activeIndex.value = -1
  close()
  emit('clear')
}

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

useClickOutside([triggerRef, panelRef], close)

defineExpose({ focus: () => inputRef.value?.focus(), close })
</script>

<template>
  <div
    ref="triggerRef"
    :class="[ns.b(), ns.is('disabled', disabled)]"
    role="combobox"
    :aria-expanded="isOpen"
    aria-haspopup="listbox"
  >
    <BiliInput
      ref="inputRef"
      :model-value="modelValue"
      :placeholder="displayPlaceholder"
      :size="mergedSize"
      :disabled="disabled"
      :clearable="clearable"
      @update:model-value="handleInput"
      @focus="handleFocus"
      @blur="scheduleClose"
      @keydown="handleKeydown"
      @clear="handleClear"
    />
  </div>

  <Teleport to="body">
    <Transition :name="ns.transition('auto-complete-dropdown')">
      <div
        v-if="isOpen"
        ref="panelRef"
        :class="[ns.e('panel'), popperClass]"
        :style="panelStyles"
        role="listbox"
      >
        <div v-if="loading" :class="ns.e('loading')">
          <BiliIcon name="loading" spin :size="14" />
          <span>{{ locale.loading }}</span>
        </div>

        <template v-else-if="suggestions.length">
          <button
            v-for="(option, index) in suggestions"
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
        </template>

        <div v-else :class="ns.e('empty')">{{ displayEmpty }}</div>
      </div>
    </Transition>
  </Teleport>
</template>
