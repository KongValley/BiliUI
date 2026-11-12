<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  useSlots,
  watch,
  type CSSProperties
} from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import {
  splitterContextKey,
  splitterProps,
  type SplitterContext,
  type SplitterPanelEntry,
  type SplitterSize
} from './splitter'

defineOptions({ name: 'BiliSplitter' })

const props = defineProps(splitterProps)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'update:sizes': [value: number[]]
  resize: [value: number | number[]]
  'resize-start': []
  'resize-end': []
  collapse: [index: number, collapsed: boolean]
}>()

const slots = useSlots()
const ns = useNamespace('splitter')
const rootRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
const isPanelMode = computed(() => !!slots.default)

/* ------------------------------ legacy mode ------------------------------ */

const clamp = (value: number) => Math.min(props.max, Math.max(props.min, value))

const rootStyle = computed<CSSProperties>(() => {
  if (isPanelMode.value) return { height: addUnit(props.height) }

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

/* ------------------------------ panel mode ------------------------------- */

const panels = reactive<SplitterPanelEntry[]>([])
const panelSizes = reactive(new Map<SplitterPanelEntry, number>())
const draggingIndex = ref<number | null>(null)
const totalSize = ref(0)
const collapsedSizes = new Map<SplitterPanelEntry, number>()

const measureTotal = (): number => {
  const root = rootRef.value
  if (!root) return 0
  const rect = root.getBoundingClientRect()
  const measured = props.direction === 'horizontal' ? rect.width : rect.height
  if (measured) return measured
  return props.direction === 'horizontal' ? root.clientWidth : root.clientHeight
}

const updateTotal = () => {
  totalSize.value = measureTotal()
}

const resolveSize = (value: SplitterSize | undefined, total: number): number | null => {
  if (value === undefined || value === '') return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null

  const text = value.trim()
  if (text.endsWith('%')) {
    const parsed = Number.parseFloat(text)
    return Number.isFinite(parsed) ? parsed : null
  }
  if (text.endsWith('px')) {
    const parsed = Number.parseFloat(text)
    return total > 0 && Number.isFinite(parsed) ? (parsed / total) * 100 : null
  }
  const parsed = Number.parseFloat(text)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeSizes(values: number[], mins: number[], maxes: number[]): number[] {
  const count = values.length
  if (!count) return []

  const safe = values.map((value, index) => {
    const min = Math.min(mins[index] ?? 0, maxes[index] ?? 100)
    const max = Math.max(min, maxes[index] ?? 100)
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0))
  })
  const sum = safe.reduce((total, value) => total + value, 0)
  let result = sum > 0 ? safe.map(value => (value / sum) * 100) : safe.map(() => 100 / count)

  result = result.map((value, index) =>
    Math.min(maxes[index] ?? 100, Math.max(mins[index] ?? 0, value))
  )
  let residual = 100 - result.reduce((total, value) => total + value, 0)
  for (let pass = 0; pass < 3 && Math.abs(residual) > 0.01; pass++) {
    const rooms = result.map((value, index) =>
      residual > 0 ? (maxes[index] ?? 100) - value : value - (mins[index] ?? 0)
    )
    const totalRoom = rooms.reduce((total, room) => total + Math.max(0, room), 0)
    if (totalRoom <= 0.01) break
    const share = Math.abs(residual)
    result = result.map((value, index) => {
      const room = Math.max(0, rooms[index])
      if (!room) return value
      const added = Math.min(room, (room / totalRoom) * share)
      return residual > 0 ? value + added : value - added
    })
    residual = 100 - result.reduce((total, value) => total + value, 0)
  }
  return result
}

const panelMins = (): number[] => {
  const total = totalSize.value || measureTotal()
  return panels.map(panel =>
    collapsedSizes.has(panel) ? 0 : (resolveSize(panel.min, total) ?? 0)
  )
}

const panelMaxes = (): number[] => {
  const total = totalSize.value || measureTotal()
  return panels.map(panel => resolveSize(panel.max, total) ?? 100)
}

const displaySizes = computed<number[]>(() => {
  const count = panels.length
  if (!count) return []

  const total = totalSize.value || measureTotal()
  const mins = panels.map(panel =>
    collapsedSizes.has(panel) ? 0 : (resolveSize(panel.min, total) ?? 0)
  )
  const maxes = panels.map(panel => resolveSize(panel.max, total) ?? 100)

  const values = panels.map((panel, index) => {
    if (props.sizes !== undefined) {
      return resolveSize(props.sizes[index], total) ?? panelSizes.get(panel) ?? 100 / count
    }
    return panelSizes.get(panel) ?? 100 / count
  })
  return normalizeSizes(values, mins, maxes)
})

const sizeOf = (entry: SplitterPanelEntry): number | undefined => {
  const index = panels.indexOf(entry)
  if (index < 0) return undefined
  // Before the parent measures and normalizes the panels, let flexbox divide
  // the space equally instead of painting a stale equal-share percentage.
  if (props.sizes === undefined && !panelSizes.has(entry)) return undefined
  return displaySizes.value[index]
}

const commitSizes = (next: number[], live = true): number[] => {
  const result = normalizeSizes(next, panelMins(), panelMaxes()).map(
    value => Math.round(value * 100) / 100
  )
  if (props.sizes === undefined) {
    panels.forEach((panel, index) => panelSizes.set(panel, result[index] ?? 0))
  }
  emit('update:sizes', result)
  if (live) emit('resize', result)
  return result
}

const normalizeFromConfigs = () => {
  if (!isPanelMode.value || props.sizes !== undefined) return
  const count = panels.length
  if (!count) {
    panelSizes.clear()
    return
  }
  if (!totalSize.value) updateTotal()
  const total = totalSize.value || measureTotal()
  const values = panels.map(panel => resolveSize(panel.size, total) ?? 100 / count)
  const mins = panels.map(panel => resolveSize(panel.min, total) ?? 0)
  const maxes = panels.map(panel => resolveSize(panel.max, total) ?? 100)
  const result = normalizeSizes(values, mins, maxes)

  panelSizes.clear()
  panels.forEach((panel, index) => panelSizes.set(panel, result[index]))
}

const registerPanel = (entry: SplitterPanelEntry) => {
  if (!panels.includes(entry)) panels.push(entry)
}

const unregisterPanel = (entry: SplitterPanelEntry) => {
  const index = panels.indexOf(entry)
  if (index < 0) return
  panels.splice(index, 1)
  panelSizes.delete(entry)
  collapsedSizes.delete(entry)
  normalizeFromConfigs()
}

const setPanelSize = (entry: SplitterPanelEntry, size: SplitterSize) => {
  entry.size = size
  if (props.sizes !== undefined) return

  const index = panels.indexOf(entry)
  if (index < 0) return

  const next = resolveSize(size, totalSize.value || measureTotal())
  if (next === null) return

  const values = [...displaySizes.value]
  const target = Math.min(100, Math.max(0, next))
  values[index] = target

  const rest = 100 - target
  const otherSum = values.reduce((total, value, current) => (current === index ? total : total + value), 0)
  const scaled = values.map((value, current) => {
    if (current === index) return target
    if (otherSum > 0) return (value / otherSum) * rest
    return rest / Math.max(1, values.length - 1)
  })
  commitSizes(scaled)
}

const canResize = (index: number): boolean => {
  const left = panels[index - 1]
  const right = panels[index]
  return !!left && !!right && left.resizable !== false && right.resizable !== false
}

const resizePair = (dividerIndex: number, delta: number) => {
  const values = [...displaySizes.value]
  const leftIndex = dividerIndex - 1
  const rightIndex = dividerIndex
  const startLeft = values[leftIndex] ?? 0
  const startRight = values[rightIndex] ?? 0
  const mins = panelMins()
  const maxes = panelMaxes()

  const lower = Math.max(mins[leftIndex] - startLeft, startRight - maxes[rightIndex])
  const upper = Math.min(maxes[leftIndex] - startLeft, startRight - mins[rightIndex])
  const applied = Math.min(upper, Math.max(lower, delta))

  values[leftIndex] = startLeft + applied
  values[rightIndex] = startRight - applied
  return commitSizes(values)
}

let panelActivePointer: number | null = null
let dragStartPosition = 0
let dragStartSizes: number[] = []

const handlePanelPointerMove = (event: PointerEvent | MouseEvent) => {
  if (draggingIndex.value === null) return
  if (
    panelActivePointer !== null &&
    'pointerId' in event &&
    event.pointerId !== panelActivePointer
  ) {
    return
  }

  const total = measureTotal() || totalSize.value
  if (!total) return

  const position =
    props.direction === 'horizontal' ? event.clientX : event.clientY
  const delta = ((position - dragStartPosition) / total) * 100
  const leftIndex = draggingIndex.value - 1
  const rightIndex = draggingIndex.value
  const startLeft = dragStartSizes[leftIndex] ?? 0
  const startRight = dragStartSizes[rightIndex] ?? 0
  const mins = panelMins()
  const maxes = panelMaxes()

  const lower = Math.max(mins[leftIndex] - startLeft, startRight - maxes[rightIndex])
  const upper = Math.min(maxes[leftIndex] - startLeft, startRight - mins[rightIndex])
  const applied = Math.min(upper, Math.max(lower, delta))

  const next = [...dragStartSizes]
  next[leftIndex] = startLeft + applied
  next[rightIndex] = startRight - applied
  commitSizes(next)
}

const stopPanelDragging = () => {
  draggingIndex.value = null
  dragging.value = false
  panelActivePointer = null
  document.removeEventListener('pointermove', handlePanelPointerMove)
  document.removeEventListener('pointerup', stopPanelDragging)
  document.removeEventListener('pointercancel', stopPanelDragging)
  emit('resize-end')
}

const startDrag = (event: PointerEvent, entry: SplitterPanelEntry) => {
  const index = panels.indexOf(entry)
  if (props.disabled || index <= 0 || !canResize(index)) return

  event.preventDefault()
  draggingIndex.value = index
  dragging.value = true
  panelActivePointer = event.pointerId
  dragStartPosition = props.direction === 'horizontal' ? event.clientX : event.clientY
  dragStartSizes = [...displaySizes.value]

  emit('resize-start')
  document.addEventListener('pointermove', handlePanelPointerMove)
  document.addEventListener('pointerup', stopPanelDragging)
  document.addEventListener('pointercancel', stopPanelDragging)
}

const toggleCollapse = (entry: SplitterPanelEntry) => {
  if (props.disabled) return

  const dividerIndex = panels.indexOf(entry)
  const right = panels[dividerIndex]
  const left = panels[dividerIndex - 1]
  const targetIndex = right?.collapsible
    ? dividerIndex
    : left?.collapsible
      ? dividerIndex - 1
      : -1
  if (targetIndex < 0) return

  const panel = panels[targetIndex]
  const values = [...displaySizes.value]
  const current = values[targetIndex] ?? 0
  const neighbor = targetIndex + 1 < panels.length ? targetIndex + 1 : targetIndex - 1

  if (current > 0.01) {
    collapsedSizes.set(panel, current)
    values[targetIndex] = 0
    if (neighbor >= 0) values[neighbor] += current
    commitSizes(values)
    emit('collapse', targetIndex, true)
    return
  }

  const restore = collapsedSizes.get(panel) ?? 100 / Math.max(1, panels.length)
  const next = [...values]
  next[targetIndex] = restore
  if (neighbor >= 0) next[neighbor] = Math.max(0, (values[neighbor] ?? 0) - (restore - current))
  collapsedSizes.delete(panel)
  commitSizes(next)
  emit('collapse', targetIndex, false)
}

const handleDividerKeydown = (event: KeyboardEvent, entry: SplitterPanelEntry) => {
  if (props.disabled) return

  const index = panels.indexOf(entry)
  if (index <= 0 || !canResize(index)) return

  if (event.key === 'Enter' || event.key === ' ') {
    if (entry.collapsible || panels[index - 1]?.collapsible) {
      event.preventDefault()
      toggleCollapse(entry)
    }
    return
  }

  const horizontal = props.direction === 'horizontal'
  const decrease = horizontal ? 'ArrowLeft' : 'ArrowUp'
  const increase = horizontal ? 'ArrowRight' : 'ArrowDown'

  if (event.key === decrease) {
    event.preventDefault()
    resizePair(index, -props.step)
  } else if (event.key === increase) {
    event.preventDefault()
    resizePair(index, props.step)
  } else if (event.key === 'Home') {
    event.preventDefault()
    const values = displaySizes.value
    resizePair(index, (panelMins()[index - 1] ?? 0) - (values[index - 1] ?? 0))
  } else if (event.key === 'End') {
    event.preventDefault()
    const values = displaySizes.value
    resizePair(index, (panelMaxes()[index - 1] ?? 100) - (values[index - 1] ?? 0))
  }
}

const update = () => {
  updateTotal()
  normalizeFromConfigs()
}

const reset = () => {
  if (props.disabled) return
  if (!isPanelMode.value) {
    commit(50)
    return
  }

  collapsedSizes.clear()
  if (props.sizes !== undefined) return

  normalizeFromConfigs()
  const sizes = panels.map(panel => panelSizes.get(panel) ?? 0)
  emit('update:sizes', sizes)
  emit('resize', sizes)
}

const context: SplitterContext = {
  get direction() {
    return props.direction
  },
  get dividerSize() {
    return props.dividerSize
  },
  get disabled() {
    return props.disabled
  },
  panels,
  draggingIndex,
  indexOf: entry => panels.indexOf(entry),
  sizeOf,
  sizeAt: index => displaySizes.value[index],
  boundsAt: index => ({ min: panelMins()[index] ?? 0, max: panelMaxes()[index] ?? 100 }),
  registerPanel,
  unregisterPanel,
  setPanelSize,
  startDrag,
  handleDividerKeydown,
  toggleCollapse
}

provide(splitterContextKey, context)

watch(() => panels.length, normalizeFromConfigs, { flush: 'post' })

let observer: ResizeObserver | null = null

onMounted(() => {
  updateTotal()
  normalizeFromConfigs()
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    observer = new ResizeObserver(() => updateTotal())
    observer.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', stopDragging)
  document.removeEventListener('pointercancel', stopDragging)
  document.removeEventListener('pointermove', handlePanelPointerMove)
  document.removeEventListener('pointerup', stopPanelDragging)
  document.removeEventListener('pointercancel', stopPanelDragging)
  observer?.disconnect()
})

defineExpose({ reset, update })
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      ns.b(),
      ns.m(direction),
      ns.is('panels', isPanelMode),
      ns.is('dragging', dragging),
      ns.is('disabled', disabled)
    ]"
    :style="rootStyle"
  >
    <template v-if="isPanelMode">
      <slot />
    </template>

    <template v-else>
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
    </template>
  </div>
</template>
