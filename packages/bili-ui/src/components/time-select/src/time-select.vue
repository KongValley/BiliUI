<script setup lang="ts">
import { computed, nextTick, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig, useLocale } from '../../../hooks/use-config'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useZIndex } from '../../../hooks/use-z-index'
import { useEventListener } from '../../../hooks/use-event-listener'
import { isTopOverlay, pushOverlay, removeOverlay } from '../../../hooks/use-overlay-stack'
import BiliIcon from '../../icon/src/icon.vue'
import { timeSelectProps } from './time-select'

defineOptions({ name: 'BiliTimeSelect' })

const props = defineProps(timeSelectProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'visible-change': [visible: boolean]
  clear: []
}>()

const ns = useNamespace('time-select')
const locale = useLocale()
const config = useConfig()
const { nextZIndex } = useZIndex()
const token = Symbol('bili-time-select')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const panelZIndex = ref(2000)
const activeIndex = ref(-1)

const mergedSize = computed(() => props.size ?? config.value.size)
const displayPlaceholder = computed(() => props.placeholder || locale.value.selectTime)
const hasValue = computed(() => !!props.modelValue)
const showClear = computed(() => props.clearable && hasValue.value && !props.disabled)

const parseMinutes = (value: string): number | null => {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(value.trim())
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return null
  return hour * 60 + minute
}

const formatMinutes = (total: number): string => {
  const hour = Math.floor(total / 60)
  const minute = total % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const generatedOptions = computed<string[]>(() => {
  if (props.options.length) return props.options

  const start = parseMinutes(props.start)
  const end = parseMinutes(props.end)
  const step = parseMinutes(props.step)
  if (start === null || end === null || step === null || step <= 0) return []

  const result: string[] = []
  for (let cursor = start; cursor <= end; cursor += step) {
    result.push(formatMinutes(cursor))
  }
  return result
})

const { floatingStyles, isPositioned } = useFloating(triggerRef, panelRef, {
  placement: 'bottom-start',
  strategy: 'fixed',
  offset: 6
})

const panelStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  minWidth: `${triggerRef.value?.getBoundingClientRect().width ?? 0}px`,
  zIndex: panelZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const open = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  panelZIndex.value = props.zIndex ?? nextZIndex()
  const index = generatedOptions.value.indexOf(props.modelValue)
  activeIndex.value = index > -1 ? index : 0
  pushOverlay(token)
  emit('visible-change', true)
  void nextTick(() => {
    listRef.value
      ?.querySelector<HTMLElement>('.is-active')
      ?.scrollIntoView({ block: 'nearest' })
  })
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  activeIndex.value = -1
  removeOverlay(token)
  emit('visible-change', false)
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const select = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  close()
  nextTick(() => triggerRef.value?.focus())
}

const clear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  close()
  nextTick(() => triggerRef.value?.focus())
}

const moveActive = (delta: number) => {
  const count = generatedOptions.value.length
  if (!count) return
  activeIndex.value = (activeIndex.value + delta + count) % count
  void nextTick(() => {
    listRef.value
      ?.querySelector<HTMLElement>('.is-active')
      ?.scrollIntoView({ block: 'nearest' })
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  if (!isOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
    }
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const value = generatedOptions.value[activeIndex.value]
    if (value) select(value)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'Tab') {
    close()
  }
}

useClickOutside([triggerRef, panelRef], () => close())

useEventListener(
  () => (typeof document !== 'undefined' ? document : undefined),
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !isOpen.value || !isTopOverlay(token)) return
    event.stopPropagation()
    close()
  }
)

watch(
  () => props.zIndex,
  value => {
    if (value !== undefined) panelZIndex.value = value
  }
)

defineExpose({ open, close, focus: () => triggerRef.value?.focus() })
</script>

<template>
  <div
    ref="triggerRef"
    :class="[
      ns.b(),
      ns.m(mergedSize),
      ns.is('open', isOpen),
      ns.is('disabled', disabled)
    ]"
    role="combobox"
    aria-haspopup="listbox"
    :aria-expanded="isOpen"
    :tabindex="disabled ? -1 : 0"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <BiliIcon :class="ns.e('icon')" name="clock" />

    <span :class="[hasValue ? ns.e('value') : ns.e('placeholder')]">
      {{ hasValue ? modelValue : displayPlaceholder }}
    </span>

    <span :class="ns.e('suffix')">
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
      <BiliIcon :class="ns.e('arrow')" name="chevron-down" />
    </span>
  </div>

  <Teleport to="body">
    <Transition :name="ns.transition('time-select-fade')">
      <div
        v-if="isOpen"
        ref="panelRef"
        :class="[ns.e('panel'), popperClass]"
        :style="panelStyles"
        role="listbox"
      >
        <div ref="listRef" :class="ns.e('list')">
          <div v-if="!generatedOptions.length" :class="ns.e('empty')">
            {{ locale.empty }}
          </div>

          <button
            v-for="(option, index) in generatedOptions"
            :key="option"
            type="button"
            :class="[
              ns.e('option'),
              ns.is('selected', option === modelValue),
              ns.is('active', index === activeIndex)
            ]"
            role="option"
            :aria-selected="option === modelValue"
            @click="select(option)"
            @mouseenter="activeIndex = index"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
