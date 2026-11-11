<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { splitterProps } from './splitter'

defineOptions({ name: 'BiliSplitter' })

const props = defineProps(splitterProps)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  resize: [value: number]
  'resize-start': []
  'resize-end': []
}>()

const ns = useNamespace('splitter')
const rootRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

const clamp = (value: number) => Math.min(props.max, Math.max(props.min, value))

const rootStyle = computed<CSSProperties>(() => {
  const size = `${clamp(props.modelValue)}%`
  const track = `${props.dividerSize}px`
  return {
    height: addUnit(props.height),
    gridTemplateColumns: props.direction === 'horizontal' ? `${size} ${track} 1fr` : undefined,
    gridTemplateRows: props.direction === 'vertical' ? `${size} ${track} 1fr` : undefined
  }
})

const commit = (value: number) => {
  const next = clamp(value)
  if (next === props.modelValue) return
  emit('update:modelValue', next)
  emit('resize', next)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  const horizontal = props.direction === 'horizontal'
  const decrease = horizontal ? 'ArrowLeft' : 'ArrowUp'
  const increase = horizontal ? 'ArrowRight' : 'ArrowDown'

  if (event.key === decrease) {
    event.preventDefault()
    commit(props.modelValue - props.step)
  } else if (event.key === increase) {
    event.preventDefault()
    commit(props.modelValue + props.step)
  } else if (event.key === 'Home') {
    event.preventDefault()
    commit(props.min)
  } else if (event.key === 'End') {
    event.preventDefault()
    commit(props.max)
  }
}

let activePointer: number | null = null

const handlePointerMove = (event: PointerEvent | MouseEvent) => {
  if (activePointer !== null && 'pointerId' in event && event.pointerId !== activePointer) return
  const root = rootRef.value
  if (!root) return
  const rect = root.getBoundingClientRect()
  const total = props.direction === 'horizontal' ? rect.width : rect.height
  if (!total) return
  const offset = props.direction === 'horizontal' ? event.clientX - rect.left : event.clientY - rect.top
  commit((offset / total) * 100)
}

const stopDragging = () => {
  dragging.value = false
  activePointer = null
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', stopDragging)
  document.removeEventListener('pointercancel', stopDragging)
  emit('resize-end')
}

const startDragging = (event: PointerEvent) => {
  if (props.disabled) return
  event.preventDefault()
  activePointer = event.pointerId
  dragging.value = true
  emit('resize-start')
  document.addEventListener('pointermove', handlePointerMove)
  document.addEventListener('pointerup', stopDragging)
  document.addEventListener('pointercancel', stopDragging)
}

const reset = () => {
  if (!props.disabled) commit(50)
}

onBeforeUnmount(() => {
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', stopDragging)
  document.removeEventListener('pointercancel', stopDragging)
})

defineExpose({ reset })
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      ns.b(),
      ns.m(direction),
      ns.is('dragging', dragging),
      ns.is('disabled', disabled)
    ]"
    :style="rootStyle"
  >
    <div :class="ns.e('start')">
      <slot name="start" />
    </div>

    <div
      :class="[ns.e('divider'), ns.is('active', dragging)]"
      role="separator"
      :aria-orientation="direction"
      :aria-valuenow="Math.round(modelValue)"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :tabindex="disabled ? -1 : 0"
      @pointerdown="startDragging"
      @keydown="handleKeydown"
      @dblclick="reset"
    >
      <span :class="ns.e('handle')" />
    </div>

    <div :class="ns.e('end')">
      <slot name="end" />
    </div>
  </div>
</template>
