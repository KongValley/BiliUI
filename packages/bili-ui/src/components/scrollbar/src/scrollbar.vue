<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  type CSSProperties
} from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { addUnit } from '../../../utils/dom'
import { scrollbarProps } from './scrollbar'

defineOptions({ name: 'BiliScrollbar' })

const props = defineProps(scrollbarProps)

const emit = defineEmits<{
  scroll: [payload: { scrollTop: number; scrollLeft: number }]
}>()

const ns = useNamespace('scrollbar')
const locale = useLocale()

const wrapRef = ref<HTMLElement | null>(null)
const viewRef = ref<HTMLElement | null>(null)
const hovered = ref(false)
const dragging = ref(false)
const scrolling = ref(false)

const state = reactive({
  vertical: { visible: false, size: 0, offset: 0, track: 0 },
  horizontal: { visible: false, size: 0, offset: 0, track: 0 }
})

let scrollTimer: ReturnType<typeof setTimeout> | null = null
let observer: ResizeObserver | null = null
let dragCleanup: (() => void) | null = null

const wrapStyle = computed<CSSProperties>(() => ({
  height: props.height !== undefined ? addUnit(props.height) : undefined,
  maxHeight: props.maxHeight !== undefined ? addUnit(props.maxHeight) : undefined
}))

const barsVisible = computed(
  () => !props.native && (props.always || hovered.value || dragging.value || scrolling.value)
)

const update = () => {
  const wrap = wrapRef.value
  if (!wrap) return

  const clientHeight = wrap.clientHeight
  const clientWidth = wrap.clientWidth
  const scrollHeight = wrap.scrollHeight
  const scrollWidth = wrap.scrollWidth

  const verticalTrack = Math.max(0, clientHeight - 4)
  const horizontalTrack = Math.max(0, clientWidth - 4)

  const hasVertical = scrollHeight - clientHeight > 1
  const hasHorizontal = scrollWidth - clientWidth > 1

  const verticalSize = hasVertical
    ? Math.min(
        verticalTrack,
        Math.max(props.minSize, (clientHeight * clientHeight) / scrollHeight)
      )
    : 0
  const horizontalSize = hasHorizontal
    ? Math.min(
        horizontalTrack,
        Math.max(props.minSize, (clientWidth * clientWidth) / scrollWidth)
      )
    : 0

  const verticalMax = scrollHeight - clientHeight
  const horizontalMax = scrollWidth - clientWidth

  state.vertical = {
    visible: hasVertical,
    size: verticalSize,
    track: verticalTrack,
    offset:
      verticalMax > 0
        ? (wrap.scrollTop / verticalMax) * Math.max(0, verticalTrack - verticalSize)
        : 0
  }
  state.horizontal = {
    visible: hasHorizontal,
    size: horizontalSize,
    track: horizontalTrack,
    offset:
      horizontalMax > 0
        ? (wrap.scrollLeft / horizontalMax) * Math.max(0, horizontalTrack - horizontalSize)
        : 0
  }
}

const handleScroll = () => {
  update()
  scrolling.value = true
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    scrolling.value = false
  }, 600)

  const wrap = wrapRef.value
  emit('scroll', {
    scrollTop: wrap?.scrollTop ?? 0,
    scrollLeft: wrap?.scrollLeft ?? 0
  })
}

const setScrollTop = (top: number) => {
  const wrap = wrapRef.value
  if (!wrap) return
  wrap.scrollTop = top
  update()
}

const startDrag = (axis: 'vertical' | 'horizontal', event: PointerEvent) => {
  const wrap = wrapRef.value
  if (!wrap || event.button !== 0) return

  event.preventDefault()
  event.stopPropagation()
  dragging.value = true

  const startX = event.clientX
  const startY = event.clientY
  const startTop = wrap.scrollTop
  const startLeft = wrap.scrollLeft
  const metrics = axis === 'vertical' ? state.vertical : state.horizontal
  const scrollRange =
    axis === 'vertical'
      ? wrap.scrollHeight - wrap.clientHeight
      : wrap.scrollWidth - wrap.clientWidth
  const thumbRange = Math.max(1, metrics.track - metrics.size)
  const ratio = thumbRange > 0 ? scrollRange / thumbRange : 0

  const handleMove = (moveEvent: PointerEvent) => {
    if (axis === 'vertical') {
      const delta = (moveEvent.clientY - startY) * ratio
      wrap.scrollTop = Math.max(0, Math.min(startTop + delta, scrollRange))
    } else {
      const delta = (moveEvent.clientX - startX) * ratio
      wrap.scrollLeft = Math.max(0, Math.min(startLeft + delta, scrollRange))
    }
  }

  const handleUp = () => {
    dragging.value = false
    dragCleanup?.()
    dragCleanup = null
  }

  document.addEventListener('pointermove', handleMove)
  document.addEventListener('pointerup', handleUp)
  dragCleanup = () => {
    document.removeEventListener('pointermove', handleMove)
    document.removeEventListener('pointerup', handleUp)
  }
}

const handleTrackClick = (axis: 'vertical' | 'horizontal', event: MouseEvent) => {
  const wrap = wrapRef.value
  const track = event.currentTarget as HTMLElement
  if (!wrap) return
  const rect = track.getBoundingClientRect()
  const metrics = axis === 'vertical' ? state.vertical : state.horizontal
  const pointer = axis === 'vertical' ? event.clientY - rect.top : event.clientX - rect.left
  const ratio = Math.max(0, Math.min(1, (pointer - metrics.size / 2) / Math.max(1, metrics.track - metrics.size)))

  if (axis === 'vertical') {
    wrap.scrollTop = ratio * Math.max(0, wrap.scrollHeight - wrap.clientHeight)
  } else {
    wrap.scrollLeft = ratio * Math.max(0, wrap.scrollWidth - wrap.clientWidth)
  }
}

const verticalThumbStyle = computed<CSSProperties>(() => ({
  height: `${state.vertical.size}px`,
  transform: `translateY(${state.vertical.offset}px)`
}))

const horizontalThumbStyle = computed<CSSProperties>(() => ({
  width: `${state.horizontal.size}px`,
  transform: `translateX(${state.horizontal.offset}px)`
}))

watch(
  () => [props.height, props.maxHeight],
  () => update()
)

onMounted(() => {
  update()
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => update())
    if (wrapRef.value) observer.observe(wrapRef.value)
    if (viewRef.value) observer.observe(viewRef.value)
  }
  // Web fonts and late images can change the content size after mount.
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(update)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  dragCleanup?.()
  if (scrollTimer) clearTimeout(scrollTimer)
})

defineExpose({ wrapRef, viewRef, update, setScrollTop })
</script>

<template>
  <div
    :class="[ns.b(), ns.is('native', native), ns.is('dragging', dragging), ns.is('always', always)]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div
      ref="wrapRef"
      :class="[ns.e('wrap'), ns.is('native', native), wrapClass]"
      :style="wrapStyle"
      :aria-label="locale.scrollbar"
      @scroll="handleScroll"
    >
      <div ref="viewRef" :class="[ns.e('view'), viewClass]">
        <slot />
      </div>
    </div>

    <template v-if="!native">
      <div
        v-show="barsVisible && state.vertical.visible"
        :class="[ns.e('bar'), ns.e('bar-vertical')]"
        role="scrollbar"
        aria-orientation="vertical"
        :aria-valuenow="state.vertical.offset"
        :aria-valuemin="0"
        :aria-valuemax="state.vertical.track"
        @click="handleTrackClick('vertical', $event)"
      >
        <div
          :class="ns.e('thumb')"
          :style="verticalThumbStyle"
          @pointerdown="startDrag('vertical', $event)"
        />
      </div>

      <div
        v-show="barsVisible && state.horizontal.visible"
        :class="[ns.e('bar'), ns.e('bar-horizontal')]"
        role="scrollbar"
        aria-orientation="horizontal"
        :aria-valuenow="state.horizontal.offset"
        :aria-valuemin="0"
        :aria-valuemax="state.horizontal.track"
        @click="handleTrackClick('horizontal', $event)"
      >
        <div
          :class="ns.e('thumb')"
          :style="horizontalThumbStyle"
          @pointerdown="startDrag('horizontal', $event)"
        />
      </div>
    </template>
  </div>
</template>
