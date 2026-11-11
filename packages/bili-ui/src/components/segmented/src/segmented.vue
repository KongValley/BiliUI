<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig } from '../../../hooks/use-config'
import BiliIcon from '../../icon/src/icon.vue'
import { segmentedProps, type SegmentedOption, type SegmentedValue } from './segmented'

defineOptions({ name: 'BiliSegmented' })

const props = defineProps(segmentedProps)

const emit = defineEmits<{
  'update:modelValue': [value: SegmentedValue]
  change: [value: SegmentedValue]
}>()

const ns = useNamespace('segmented')
const config = useConfig()
const mergedSize = computed(() => props.size ?? config.value.size)

const rootRef = ref<HTMLElement | null>(null)
const itemRefs = ref<Array<HTMLButtonElement | null>>([])
const thumb = ref({ left: 0, width: 0, visible: false })

const setItemRef = (el: Element | null, index: number) => {
  itemRefs.value[index] = el as HTMLButtonElement | null
}

const enabledOptions = computed(() => props.options.filter(option => !option.disabled))

const isSelected = (option: SegmentedOption) => option.value === props.modelValue

const updateThumb = () => {
  const index = props.options.findIndex(isSelected)
  const item = itemRefs.value[index]
  if (!item || typeof item.offsetWidth !== 'number') {
    thumb.value = { left: 0, width: 0, visible: false }
    return
  }
  thumb.value = {
    left: item.offsetLeft,
    width: item.offsetWidth,
    visible: true
  }
}

const select = (option: SegmentedOption) => {
  if (props.disabled || option.disabled || isSelected(option)) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

const move = (delta: number) => {
  const enabled = enabledOptions.value
  if (!enabled.length) return
  const current = enabled.findIndex(isSelected)
  const start = current === -1 ? (delta > 0 ? -1 : 0) : current
  const next = (start + delta + enabled.length) % enabled.length
  const option = enabled[next]
  select(option)
  const index = props.options.indexOf(option)
  nextTick(() => itemRefs.value[index]?.focus())
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    move(1)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    move(-1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    const first = enabledOptions.value[0]
    if (first) select(first)
  } else if (event.key === 'End') {
    event.preventDefault()
    const last = enabledOptions.value[enabledOptions.value.length - 1]
    if (last) select(last)
  }
}

const thumbStyle = computed<CSSProperties>(() => ({
  width: `${thumb.value.width}px`,
  transform: `translateX(${thumb.value.left}px)`,
  opacity: thumb.value.visible ? 1 : 0
}))

let observer: ResizeObserver | null = null

onMounted(() => {
  nextTick(updateThumb)
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    observer = new ResizeObserver(updateThumb)
    observer.observe(rootRef.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())

watch(
  [() => props.modelValue, () => props.options],
  () => nextTick(updateThumb),
  { deep: true }
)
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      ns.b(),
      ns.m(mergedSize),
      ns.is('block', block),
      ns.is('disabled', disabled)
    ]"
    role="radiogroup"
    :aria-label="name || undefined"
    @keydown="handleKeydown"
  >
    <span :class="ns.e('thumb')" :style="thumbStyle" aria-hidden="true" />

    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="el => setItemRef(el as Element | null, index)"
      :class="[ns.e('item'), ns.is('selected', isSelected(option))]"
      type="button"
      role="radio"
      :aria-checked="isSelected(option)"
      :disabled="disabled || option.disabled"
      :tabindex="isSelected(option) || (!modelValue && index === 0) ? 0 : -1"
      @click="select(option)"
    >
      <BiliIcon v-if="option.icon" :class="ns.e('icon')" :name="option.icon" :size="14" />
      <span :class="ns.e('label')">{{ option.label }}</span>
    </button>
  </div>
</template>
