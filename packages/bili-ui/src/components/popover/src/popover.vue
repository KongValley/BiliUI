<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRef, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useZIndex } from '../../../hooks/use-z-index'
import { addUnit } from '../../../utils/dom'
import { popoverProps } from './popover'

defineOptions({ name: 'BiliPopover' })

const props = defineProps(popoverProps)

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'visible-change': [visible: boolean]
}>()

const ns = useNamespace('popover')
const { nextZIndex, currentZIndex } = useZIndex()

const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)
const innerVisible = ref(props.visible ?? false)

const visible = computed(() => props.visible ?? innerVisible.value)

const { floatingStyles, arrowStyles, placement, isPositioned } = useFloating(
  triggerRef,
  contentRef,
  {
    placement: toRef(props, 'placement'),
    offset: props.offset,
    arrowEl: arrowRef
  }
)

const contentStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  zIndex: currentZIndex.value,
  width: props.width !== undefined ? addUnit(props.width) : undefined,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const setVisible = (value: boolean) => {
  if (props.disabled || visible.value === value) return
  if (value) nextZIndex()
  innerVisible.value = value
  emit('update:visible', value)
  emit('visible-change', value)
}

const open = () => setVisible(true)
const close = () => setVisible(false)
const toggle = () => setVisible(!visible.value)

let hideTimer: ReturnType<typeof setTimeout> | null = null

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const scheduleClose = () => {
  clearHideTimer()
  hideTimer = setTimeout(close, 120)
}

const handleEnter = () => {
  clearHideTimer()
  if (props.trigger === 'hover') open()
}

const handleLeave = () => {
  if (props.trigger === 'hover') scheduleClose()
}

const handleClick = () => {
  if (props.trigger === 'click') toggle()
}

const handleFocusIn = () => {
  if (props.trigger === 'focus' || props.trigger === 'hover') open()
}

const handleFocusOut = () => {
  if (props.trigger === 'focus' || props.trigger === 'hover') close()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && visible.value) close()
}

useClickOutside([triggerRef, contentRef], () => {
  if (props.closeOnClickOutside && props.trigger === 'click' && visible.value) close()
})

onBeforeUnmount(clearHideTimer)

defineExpose({ open, close, toggle })
</script>

<template>
  <div
    ref="triggerRef"
    :class="ns.b()"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @click="handleClick"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @keydown="handleKeydown"
  >
    <slot name="reference">
      <slot />
    </slot>

    <Teleport to="body">
      <Transition :name="ns.transition('popover')">
        <div
          v-if="visible"
          ref="contentRef"
          :class="[ns.e('content'), ns.is('with-title', !!title || !!$slots.title), popperClass]"
          :style="contentStyles"
          role="dialog"
          @mouseenter="handleEnter"
          @mouseleave="handleLeave"
        >
          <div v-if="title || $slots.title" :class="ns.e('title')">
            <slot name="title">{{ title }}</slot>
          </div>

          <div :class="ns.e('body')">
            <slot name="content">{{ content }}</slot>
          </div>

          <div v-if="$slots.footer" :class="ns.e('footer')">
            <slot name="footer" />
          </div>

          <span
            v-if="showArrow"
            ref="arrowRef"
            :class="ns.e('arrow')"
            :style="arrowStyles"
            :data-placement="placement"
            aria-hidden="true"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
