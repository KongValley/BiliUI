<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  reactive,
  watch,
  watchEffect,
  type CSSProperties
} from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import {
  splitterContextKey,
  splitterPanelProps,
  type SplitterPanelEntry
} from './splitter'

defineOptions({ name: 'BiliSplitterPanel', inheritAttrs: false })

const props = defineProps(splitterPanelProps)

const ns = useNamespace('splitter')
const ctx = inject(splitterContextKey, null)

const entry = reactive<SplitterPanelEntry>({
  size: props.size,
  min: props.min,
  max: props.max,
  collapsible: props.collapsible,
  resizable: props.resizable
})

ctx?.registerPanel(entry)

onBeforeUnmount(() => ctx?.unregisterPanel(entry))

watch(
  () => props.size,
  value => {
    entry.size = value
    if (value !== undefined) ctx?.setPanelSize(entry, value)
  }
)

watchEffect(() => {
  entry.min = props.min
  entry.max = props.max
  entry.collapsible = props.collapsible
  entry.resizable = props.resizable
})

const index = computed(() => ctx?.indexOf(entry) ?? 0)
const showDivider = computed(() => !!ctx && index.value > 0)
const size = computed(() => ctx?.sizeOf(entry))

const panelStyle = computed<CSSProperties>(() => {
  const value = size.value
  if (value === undefined) return { flex: '1 1 0' }
  return { flex: `0 0 ${Math.max(0, value)}%` }
})

const dividerStyle = computed<CSSProperties>(() => {
  const track = `${ctx?.dividerSize ?? 6}px`
  return ctx?.direction === 'vertical'
    ? { height: track, width: '100%', flex: `0 0 ${track}` }
    : { width: track, height: '100%', flex: `0 0 ${track}` }
})

const resizable = computed(() => {
  if (!ctx || ctx.disabled || !entry.resizable) return false
  const left = ctx.panels[index.value - 1]
  return !!left && left.resizable !== false
})

const ariaValue = computed(() => Math.round(ctx?.sizeAt(index.value - 1) ?? 0))
const ariaMin = computed(() => Math.round(ctx?.boundsAt(index.value - 1).min ?? 0))
const ariaMax = computed(() => Math.round(ctx?.boundsAt(index.value - 1).max ?? 100))
const active = computed(() => ctx?.draggingIndex.value === index.value)
</script>

<template>
  <div :class="ns.e('panel-wrapper')">
    <div
      v-if="showDivider"
      :class="[ns.e('divider'), ns.is('active', active)]"
      :style="dividerStyle"
      role="separator"
      :aria-orientation="ctx?.direction"
      :aria-valuenow="ariaValue"
      :aria-valuemin="ariaMin"
      :aria-valuemax="ariaMax"
      :tabindex="resizable ? 0 : -1"
      @pointerdown="ctx?.startDrag($event, entry)"
      @keydown="ctx?.handleDividerKeydown($event, entry)"
      @dblclick="ctx?.toggleCollapse(entry)"
    >
      <span :class="ns.e('handle')" />
    </div>

    <div
      v-bind="$attrs"
      :class="[ns.e('panel'), ns.is('collapsed', size === 0)]"
      :style="panelStyle"
      :aria-hidden="size === 0 ? 'true' : undefined"
    >
      <slot />
    </div>
  </div>
</template>
