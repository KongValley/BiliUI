<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRef, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useId } from '../../../hooks/use-id'
import { useZIndex } from '../../../hooks/use-z-index'
import { addUnit } from '../../../utils/dom'
import { tooltipProps } from './tooltip'

defineOptions({ name: 'BiliTooltip' })

const props = defineProps(tooltipProps)

const emit = defineEmits<{
  'visible-change': [visible: boolean]
}>()

const ns = useNamespace('tooltip')
const tooltipId = useId('bili-tooltip')
const { nextZIndex, currentZIndex } = useZIndex()

const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)
const visible = ref(false)

const originMap: Record<string, string> = {
  top: 'center bottom',
  bottom: 'center top',
  left: 'right center',
  right: 'left center'
}

const { floatingStyles, arrowStyles, placement, isPositioned } = useFloating(
  triggerRef,
  contentRef,
  {
    placement: toRef(props, 'placement'),
    offset: props.offset,
    arrowEl: arrowRef
  }
)

let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const clearTimers = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const setVisible = (value: boolean) => {
  if (visible.value === value) return
  if (value) nextZIndex()
  visible.value = value
  emit('visible-change', value)
}

const show = (immediate = false) => {
  if (props.disabled) return
  clearTimers()
  const delay = immediate ? 0 : props.delay
  if (delay <= 0) {
    setVisible(true)
    return
  }
  showTimer = setTimeout(() => setVisible(true), delay)
}

const hide = (immediate = false) => {
  clearTimers()
  const delay = immediate ? 0 : props.delay
  if (delay <= 0) {
    setVisible(false)
    return
  }
  hideTimer = setTimeout(() => setVisible(false), delay)
}

const handleMouseEnter = () => {
  if (props.trigger === 'hover') show()
}

const handleMouseLeave = () => {
  if (props.trigger === 'hover') hide()
}

const handleFocusIn = () => {
  if (props.trigger === 'hover' || props.trigger === 'focus') show()
}

const handleFocusOut = () => {
  if (props.trigger === 'hover' || props.trigger === 'focus') hide()
}

const handleClick = () => {
  if (props.trigger !== 'click') return
  if (visible.value) hide(true)
  else show(true)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && visible.value) {
    hide(true)
  }
}

const contentStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  zIndex: currentZIndex.value,
  maxWidth: props.maxWidth !== undefined ? addUnit(props.maxWidth) : undefined,
  visibility: isPositioned.value ? 'visible' : 'hidden',
  // Grow from the side nearest the trigger so the entrance reads as connected.
  [ns.cssVarBlock('zoom-origin')]: originMap[placement.value.split('-')[0]] ?? 'center'
}))

useClickOutside([triggerRef, contentRef], () => {
  if (props.trigger === 'click' && visible.value) hide(true)
})

onBeforeUnmount(clearTimers)

defineExpose({ show, hide, visible })
</script>

<template>
  <span
    ref="triggerRef"
    :class="ns.e('trigger')"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </span>

  <Teleport to="body">
    <Transition :name="ns.transition('tooltip-fade')">
      <div
        v-if="visible"
        :id="tooltipId"
        ref="contentRef"
        :class="[ns.e('content'), ns.m(effect), popperClass]"
        :style="contentStyles"
        role="tooltip"
      >
        <slot name="content">{{ content }}</slot>
        <span
          v-if="showArrow"
          ref="arrowRef"
          :class="ns.e('arrow')"
          :style="arrowStyles"
          :data-placement="placement"
        />
      </div>
    </Transition>
  </Teleport>
</template>
