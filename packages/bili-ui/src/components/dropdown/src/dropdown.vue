<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type CSSProperties } from 'vue'
import type { Placement } from '@floating-ui/dom'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useZIndex } from '../../../hooks/use-z-index'
import BiliIcon from '../../icon/src/icon.vue'
import { dropdownProps, type DropdownItem } from './dropdown'
import { provideDropdownContext } from './context'

defineOptions({ name: 'BiliDropdown' })

const props = defineProps(dropdownProps)

const emit = defineEmits<{
  command: [key: string, item: DropdownItem]
  'visible-change': [visible: boolean]
}>()

const ns = useNamespace('dropdown')
const { nextZIndex, currentZIndex } = useZIndex()

const triggerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const visible = ref(false)

const {
  floatingStyles,
  isPositioned,
  placement: resolvedPlacement
} = useFloating(triggerRef, popupRef, { placement: props.placement as Placement, offset: 6 })

const popupStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  zIndex: currentZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

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

const open = () => {
  if (props.disabled || visible.value) return
  clearTimers()
  nextZIndex()
  visible.value = true
  emit('visible-change', true)
}

const close = () => {
  if (!visible.value) return
  clearTimers()
  visible.value = false
  emit('visible-change', false)
}

const toggle = () => {
  if (props.disabled) return
  if (visible.value) close()
  else open()
}

const scheduleOpen = () => {
  if (props.trigger !== 'hover' || props.disabled) return
  clearTimers()
  showTimer = setTimeout(open, props.showTimeout)
}

const scheduleClose = () => {
  if (props.trigger !== 'hover') return
  clearTimers()
  hideTimer = setTimeout(close, props.hideTimeout)
}

const handleTriggerClick = (event: MouseEvent) => {
  if (props.trigger !== 'click') return
  event.stopPropagation()
  toggle()
}

const handleContextMenu = (event: MouseEvent) => {
  if (props.trigger !== 'contextmenu') return
  event.preventDefault()
  if (visible.value) close()
  else open()
}

const select = (key: string) => {
  const item = props.items.find(entry => entry.key === key)
  if (item?.disabled) return
  emit('command', key, item as DropdownItem)
  close()
}

provideDropdownContext({ close, select })

useClickOutside([triggerRef, popupRef], () => {
  if (props.trigger === 'click' || props.trigger === 'contextmenu') close()
})

onBeforeUnmount(clearTimers)

defineExpose({ open, close, toggle })
</script>

<template>
  <div
    ref="triggerRef"
    :class="[ns.b(), ns.is('open', visible), ns.is('disabled', disabled)]"
    @mouseenter="scheduleOpen"
    @mouseleave="scheduleClose"
    @click="handleTriggerClick"
    @contextmenu="handleContextMenu"
  >
    <slot>
      <button :class="ns.e('trigger')" type="button" :disabled="disabled">
        <slot name="trigger" />
        <BiliIcon
          v-if="arrow"
          :class="[ns.e('arrow'), ns.is('open', visible)]"
          name="chevron-down"
          :size="14"
        />
      </button>
    </slot>

    <Teleport to="body">
      <Transition name="bili-dropdown">
        <div
          v-if="visible"
          ref="popupRef"
          :class="[ns.e('popup'), popperClass]"
          :style="popupStyles"
          :data-placement="resolvedPlacement.split('-')[0]"
          role="menu"
          @mouseenter="clearTimers"
          @mouseleave="scheduleClose"
        >
          <slot name="dropdown">
            <template v-for="item in items" :key="item.key">
              <div v-if="item.divided" :class="ns.e('divider')" role="separator" />
              <button
                :class="[
                  ns.e('item'),
                  ns.is('disabled', item.disabled),
                  ns.is('divided', item.divided)
                ]"
                type="button"
                role="menuitem"
                :disabled="item.disabled"
                @click="select(item.key)"
              >
                <BiliIcon v-if="item.icon" :class="ns.e('item-icon')" :name="item.icon" />
                <span :class="ns.e('item-label')">{{ item.label }}</span>
                <span v-if="item.shortcut" :class="ns.e('item-shortcut')">{{ item.shortcut }}</span>
              </button>
            </template>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
