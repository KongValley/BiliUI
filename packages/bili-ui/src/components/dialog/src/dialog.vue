<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { useFocusTrap } from '../../../hooks/use-focus-trap'
import { useScrollLock } from '../../../hooks/use-scroll-lock'
import { useZIndex } from '../../../hooks/use-z-index'
import { useEventListener } from '../../../hooks/use-event-listener'
import { isTopOverlay, pushOverlay, removeOverlay } from '../../../hooks/use-overlay-stack'
import { addUnit } from '../../../utils/dom'
import BiliIcon from '../../icon/src/icon.vue'
import { dialogProps } from './dialog'

defineOptions({ name: 'BiliDialog' })

const props = defineProps(dialogProps)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  opened: []
  close: []
  closed: []
}>()

const ns = useNamespace('dialog')
const locale = useLocale()
const dialogRef = ref<HTMLElement | null>(null)
const mounted = ref(props.modelValue)
const visible = ref(props.modelValue)
const modalZIndex = ref(2000)
const token = Symbol('bili-dialog')

const { nextZIndex } = useZIndex()

const dialogStyle = computed(() => ({
  width: addUnit(props.width),
  marginTop: addUnit(props.top)
}))

const shouldLockScroll = computed(() => props.lockScroll && visible.value)

useScrollLock(shouldLockScroll)
useFocusTrap(dialogRef, visible)

const requestClose = () => {
  if (!visible.value) return
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnClickModal) requestClose()
}

const onAfterEnter = () => {
  emit('opened')
}

const onAfterLeave = () => {
  removeOverlay(token)
  if (props.destroyOnClose) mounted.value = false
  emit('closed')
}

watch(
  () => props.modelValue,
  value => {
    if (value) {
      modalZIndex.value = nextZIndex()
      mounted.value = true
      visible.value = true
      pushOverlay(token)
      emit('open')
    } else {
      visible.value = false
      removeOverlay(token)
    }
  },
  { immediate: true }
)

useEventListener(
  () => (typeof document !== 'undefined' ? document : undefined),
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !visible.value || !props.closeOnEsc) return
    if (!isTopOverlay(token)) return
    event.stopPropagation()
    requestClose()
  }
)

onBeforeUnmount(() => {
  removeOverlay(token)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="bili-dialog" appear @after-enter="onAfterEnter" @after-leave="onAfterLeave">
      <div
        v-if="mounted"
        v-show="visible"
        :class="[ns.e('overlay'), overlayClass]"
        :style="{ zIndex: modalZIndex }"
        @click.self="handleOverlayClick"
      >
        <div
          ref="dialogRef"
          :class="[ns.b(), panelClass]"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          tabindex="-1"
        >
          <div v-if="title || $slots.header || showClose" :class="ns.e('header')">
            <div :class="ns.e('title')">
              <slot name="header">{{ title }}</slot>
            </div>
            <button
              v-if="showClose"
              :class="ns.e('close')"
              type="button"
              :aria-label="locale.close"
              @click="requestClose"
            >
              <BiliIcon name="close" />
            </button>
          </div>

          <div :class="ns.e('body')">
            <slot />
          </div>

          <div v-if="$slots.footer" :class="ns.e('footer')">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
