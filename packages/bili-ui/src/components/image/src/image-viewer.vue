<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { useScrollLock } from '../../../hooks/use-scroll-lock'
import { useFocusTrap } from '../../../hooks/use-focus-trap'
import { useZIndex } from '../../../hooks/use-z-index'
import { useEventListener } from '../../../hooks/use-event-listener'
import { isTopOverlay, pushOverlay, removeOverlay } from '../../../hooks/use-overlay-stack'
import BiliIcon from '../../icon/src/icon.vue'
import { imageViewerProps } from './image'

defineOptions({ name: 'BiliImageViewer' })

const props = defineProps(imageViewerProps)

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  close: []
  switch: [index: number]
}>()

const ns = useNamespace('image-viewer')
const locale = useLocale()
const overlayRef = ref<HTMLElement | null>(null)
const token = Symbol('bili-image-viewer')
const { nextZIndex } = useZIndex()

const zIndex = ref(props.zIndex ?? 0)
const activeIndex = ref(0)
const scale = ref(1)
const rotate = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const dragging = ref(false)

const isOpen = computed(() => props.visible)

useScrollLock(isOpen)
useFocusTrap(overlayRef, isOpen)

const count = computed(() => props.urlList.length)
const currentUrl = computed(() => props.urlList[activeIndex.value] ?? '')
const hasMultiple = computed(() => count.value > 1)
const displayScale = computed(() => `${Math.round(scale.value * 100)}%`)

const imageStyle = computed(() => ({
  transform: `translate3d(${translateX.value}px, ${translateY.value}px, 0) scale(${scale.value}) rotate(${rotate.value}deg)`
}))

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const resetTransform = () => {
  scale.value = 1
  rotate.value = 0
  translateX.value = 0
  translateY.value = 0
}

const setScale = (next: number) => {
  scale.value = clamp(next, props.minScale, props.maxScale)
  if (scale.value <= 1) {
    translateX.value = 0
    translateY.value = 0
  }
}

const zoomIn = () => setScale(scale.value * props.zoomRate)
const zoomOut = () => setScale(scale.value / props.zoomRate)
const toggleScale = () => setScale(scale.value === 1 ? 2 : 1)
const rotateLeft = () => {
  rotate.value -= 90
}
const rotateRight = () => {
  rotate.value += 90
}

const setActiveIndex = (index: number) => {
  if (count.value === 0) return
  const next = ((index % count.value) + count.value) % count.value
  if (next === activeIndex.value) return
  activeIndex.value = next
  resetTransform()
  emit('switch', next)
}

const prev = () => setActiveIndex(activeIndex.value - 1)
const next = () => setActiveIndex(activeIndex.value + 1)

const close = () => {
  if (!props.visible) return
  emit('update:visible', false)
  emit('close')
}

const handleMaskClick = () => {
  if (props.hideOnClickModal) close()
}

const handleWheel = (event: WheelEvent) => {
  if (event.deltaY === 0) return
  if (event.deltaY < 0) zoomIn()
  else zoomOut()
}

let startX = 0
let startY = 0
let originX = 0
let originY = 0

const handlePointerMove = (event: PointerEvent) => {
  if (!dragging.value) return
  event.preventDefault()
  translateX.value = originX + event.clientX - startX
  translateY.value = originY + event.clientY - startY
}

const stopDrag = () => {
  if (!dragging.value) return
  dragging.value = false
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', stopDrag)
}

const startDrag = (event: PointerEvent) => {
  if (event.button !== 0) return
  event.preventDefault()
  dragging.value = true
  startX = event.clientX
  startY = event.clientY
  originX = translateX.value
  originY = translateY.value
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', stopDrag)
}

watch(
  () => props.visible,
  visible => {
    if (visible) {
      activeIndex.value = clamp(props.initialIndex, 0, Math.max(0, count.value - 1))
      resetTransform()
      zIndex.value = props.zIndex ?? nextZIndex()
      pushOverlay(token)
    } else {
      stopDrag()
      removeOverlay(token)
    }
  },
  { immediate: true }
)

watch(
  () => props.initialIndex,
  index => {
    if (!props.visible) return
    activeIndex.value = clamp(index, 0, Math.max(0, count.value - 1))
    resetTransform()
  }
)

watch(
  () => props.zIndex,
  value => {
    if (value !== undefined) zIndex.value = value
  }
)

useEventListener(
  () => (typeof document !== 'undefined' ? document : undefined),
  'keydown',
  (event: KeyboardEvent) => {
    if (!props.visible || !isTopOverlay(token)) return
    switch (event.key) {
      case 'Escape':
        if (!props.closeOnPressEscape) return
        event.preventDefault()
        close()
        break
      case 'ArrowLeft':
        event.preventDefault()
        prev()
        break
      case 'ArrowRight':
        event.preventDefault()
        next()
        break
      case '+':
      case '=':
        event.preventDefault()
        zoomIn()
        break
      case '-':
        event.preventDefault()
        zoomOut()
        break
      case '0':
        event.preventDefault()
        resetTransform()
        break
    }
  }
)

onBeforeUnmount(() => {
  stopDrag()
  removeOverlay(token)
})

defineExpose({
  setActiveIndex,
  zoomIn,
  zoomOut,
  rotateLeft,
  rotateRight,
  resetTransform
})
</script>

<template>
  <Teleport to="body" :disabled="!teleported">
    <Transition :name="ns.transition('image-viewer')">
      <div
        v-if="visible"
        ref="overlayRef"
        :class="[ns.b(), previewClass]"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        :aria-label="locale.imagePreview"
        tabindex="-1"
        @click.self="handleMaskClick"
      >
        <div :class="ns.e('canvas')" @click.self="handleMaskClick" @wheel.prevent="handleWheel">
          <img
            v-if="currentUrl"
            :key="currentUrl"
            :src="currentUrl"
            :alt="alt"
            :class="[ns.e('img'), ns.is('dragging', dragging)]"
            :style="imageStyle"
            draggable="false"
            @pointerdown="startDrag"
            @dblclick="toggleScale"
            @dragstart.prevent
          />
        </div>

        <button type="button" :class="ns.e('close')" :aria-label="locale.closePreview" @click="close">
          <BiliIcon name="close" />
        </button>

        <div v-if="hasMultiple" :class="ns.e('counter')">{{ activeIndex + 1 }} / {{ count }}</div>

        <template v-if="hasMultiple">
          <button
            type="button"
            :class="[ns.e('arrow'), ns.e('arrow--prev')]"
            :aria-label="locale.prevImage"
            @click="prev"
          >
            <BiliIcon name="chevron-left" />
          </button>
          <button
            type="button"
            :class="[ns.e('arrow'), ns.e('arrow--next')]"
            :aria-label="locale.nextImage"
            @click="next"
          >
            <BiliIcon name="chevron-right" />
          </button>
        </template>

        <div :class="ns.e('actions')">
          <button type="button" :class="ns.e('action')" :title="locale.zoomOut" @click="zoomOut">
            <BiliIcon name="zoom-out" />
          </button>
          <span :class="ns.e('scale')">{{ displayScale }}</span>
          <button type="button" :class="ns.e('action')" :title="locale.zoomIn" @click="zoomIn">
            <BiliIcon name="zoom-in" />
          </button>
          <span :class="ns.e('divider')" />
          <button type="button" :class="ns.e('action')" :title="locale.actualSize" @click="resetTransform">
            <BiliIcon name="maximize" />
          </button>
          <button type="button" :class="ns.e('action')" :title="locale.rotateLeft" @click="rotateLeft">
            <BiliIcon name="undo" />
          </button>
          <button type="button" :class="ns.e('action')" :title="locale.rotateRight" @click="rotateRight">
            <BiliIcon name="redo" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
