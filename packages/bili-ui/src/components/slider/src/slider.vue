<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { sliderProps } from './slider'

defineOptions({ name: 'BiliSlider' })

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const props = defineProps(sliderProps)

const emit = defineEmits<{
  'update:modelValue': [value: number | [number, number]]
  change: [value: number | [number, number]]
}>()

const ns = useNamespace('slider')

const trackRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
const activeHandle = ref(0)

const isRange = computed(() => Array.isArray(props.modelValue))

const values = computed<[number, number]>(() => {
  if (isRange.value) {
    const [start, end] = props.modelValue as [number, number]
    return [Math.min(start, end), Math.max(start, end)]
  }
  return [props.modelValue as number, props.modelValue as number]
})

const span = computed(() => Math.max(1e-9, props.max - props.min))

const toPercent = (value: number): number =>
  clamp(((value - props.min) / span.value) * 100, 0, 100)

const percent = computed<[number, number]>(() => [
  toPercent(values.value[0]),
  toPercent(values.value[1])
])

const fillStyle = computed(() => ({
  left: `${percent.value[0]}%`,
  width: `${percent.value[1] - percent.value[0]}%`
}))

const snap = (raw: number): number => {
  const stepped = Math.round((raw - props.min) / props.step) * props.step + props.min
  const factor = Math.pow(10, String(props.step).split('.')[1]?.length ?? 0)
  return clamp(Math.round(stepped * factor) / factor, props.min, props.max)
}

const formatValue = (value: number): string =>
  props.formatTooltip ? props.formatTooltip(value) : String(value)

/** Converts a pointer position into a value along the track. */
const valueFromEvent = (event: PointerEvent | MouseEvent): number => {
  const el = trackRef.value
  if (!el) return props.min
  const rect = el.getBoundingClientRect()
  const ratio = props.vertical
    ? 1 - (event.clientY - rect.top) / rect.height
    : (event.clientX - rect.left) / rect.width
  return snap(props.min + clamp(ratio, 0, 1) * span.value)
}

const handleHandleIndex = (event: PointerEvent): number => {
  if (!isRange.value) return 0
  const value = valueFromEvent(event)
  const [start, end] = values.value
  return Math.abs(value - start) <= Math.abs(value - end) ? 0 : 1
}

const updateValue = (index: number, next: number) => {
  if (isRange.value) {
    const pair: [number, number] = [...values.value] as [number, number]
    pair[index] = next
    const normalized: [number, number] = [Math.min(pair[0], pair[1]), Math.max(pair[0], pair[1])]
    emit('update:modelValue', normalized)
    emit('change', normalized)
    return
  }
  emit('update:modelValue', next)
  emit('change', next)
}

const startDrag = (event: PointerEvent) => {
  if (props.disabled) return
  const index = handleHandleIndex(event)
  activeHandle.value = index
  dragging.value = true
  updateValue(index, valueFromEvent(event))
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

const handleMove = (event: PointerEvent) => {
  if (!dragging.value || props.disabled) return
  updateValue(activeHandle.value, valueFromEvent(event))
}

const endDrag = () => {
  dragging.value = false
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (props.disabled) return
  const delta = event.key === 'ArrowRight' || event.key === 'ArrowUp'
    ? props.step
    : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
      ? -props.step
      : 0
  if (!delta) return
  event.preventDefault()
  updateValue(index, snap(values.value[index] + delta))
}

const markEntries = computed(() => {
  if (!props.marks) return []
  if (props.marks === true) {
    return [0, 25, 50, 75, 100].map(ratio => {
      const value = props.min + (span.value * ratio) / 100
      return { value, label: String(value), left: ratio }
    })
  }
  return Object.entries(props.marks).map(([rawValue, label]) => {
    const value = Number(rawValue)
    return { value, label: String(label), left: toPercent(value) }
  })
})
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.is('disabled', disabled),
      ns.is('range', isRange),
      vertical ? ns.m('vertical') : '',
      ns.is('with-marks', !!marks)
    ]"
  >
    <div
      ref="trackRef"
      :class="ns.e('track')"
      role="slider"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="values[0]"
      :aria-disabled="disabled"
      :tabindex="disabled ? -1 : 0"
      @pointerdown="startDrag"
      @pointermove="handleMove"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @keydown="handleKeydown($event, 0)"
    >
      <div :class="ns.e('rail')" />
      <div :class="ns.e('fill')" :style="fillStyle" />

      <button
        v-for="(value, index) in isRange ? [values[0], values[1]] : [values[0]]"
        :key="index"
        :class="[ns.e('handle'), ns.is('dragging', dragging && activeHandle === index)]"
        type="button"
        :style="{ left: `${percent[index]}%` }"
        :disabled="disabled"
        :aria-label="`滑块 ${index + 1}`"
        @keydown.stop="handleKeydown($event, index)"
      >
        <span v-if="showTooltip" :class="ns.e('tooltip')">{{ formatValue(value) }}</span>
      </button>

      <div v-if="markEntries.length" :class="ns.e('marks')">
        <span
          v-for="mark in markEntries"
          :key="mark.value"
          :class="ns.e('mark')"
          :style="{ left: `${mark.left}%` }"
        >
          <span :class="ns.e('mark-dot')" />
          <span :class="ns.e('mark-label')">{{ mark.label }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
