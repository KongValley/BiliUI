<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
import type { Placement } from '@floating-ui/dom'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFloating } from '../../../hooks/use-floating'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { useZIndex } from '../../../hooks/use-z-index'
import BiliIcon from '../../icon/src/icon.vue'
import { subMenuProps } from './menu'
import { useMenuContext } from './context'
import MenuPanelProvider from './panel-provider.vue'

defineOptions({ name: 'BiliSubMenu' })

const props = defineProps(subMenuProps)

const ns = useNamespace('sub-menu')
const menu = useMenuContext()
const { nextZIndex, currentZIndex } = useZIndex()

const triggerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const popupVisible = ref(false)

// Vertical, expanded, top-level sub menus render inline; everything else floats.
const isInline = computed(
  () => menu.mode.value === 'vertical' && !menu.collapsed.value && !menu.inPanel
)

const opened = computed(() => menu.isOpen(props.subKey))
const expanded = computed(() => (isInline.value ? opened.value : popupVisible.value))
const showLabel = computed(() => !menu.collapsed.value || menu.inPanel)

// Nested panels always open to the side; horizontal top-level items open below.
const opensToSide = computed(
  () => menu.inPanel || (menu.mode.value === 'vertical' && menu.collapsed.value)
)

const arrowName = computed(() => (opensToSide.value ? 'chevron-right' : 'chevron-down'))

const placement = computed<Placement>(() =>
  opensToSide.value ? 'right-start' : 'bottom-start'
)

const { floatingStyles, isPositioned, placement: resolvedPlacement } = useFloating(
  triggerRef,
  popupRef,
  { placement, offset: 4 }
)

const popupStyles = computed<CSSProperties>(() => ({
  ...floatingStyles.value,
  zIndex: currentZIndex.value,
  visibility: isPositioned.value ? 'visible' : 'hidden'
}))

const openPopup = () => {
  if (props.disabled || popupVisible.value || isInline.value) return
  nextZIndex()
  popupVisible.value = true
}

const closePopup = () => {
  popupVisible.value = false
}

const toggle = () => {
  if (props.disabled) return
  if (isInline.value) menu.toggleOpen(props.subKey)
  else if (popupVisible.value) closePopup()
  else openPopup()
}

const isHover = computed(() => menu.triggerValue.value === 'hover')

const handleTriggerEnter = () => {
  if (isHover.value) openPopup()
}

const handleTriggerLeave = () => {
  if (isHover.value) closePopup()
}

const handleClick = () => {
  if (isHover.value) {
    // Hover menus still open on click for touch and keyboard users.
    toggle()
    return
  }
  toggle()
}

const handlePanelEnter = () => {
  if (isHover.value) openPopup()
}

const handlePanelLeave = () => {
  if (isHover.value) closePopup()
}

useClickOutside([triggerRef, popupRef], () => {
  if (!isInline.value) closePopup()
})
</script>

<template>
  <li
    :class="[
      ns.b(),
      ns.is('open', expanded),
      ns.is('disabled', disabled),
      ns.is('collapsed', menu.collapsed.value && !menu.inPanel)
    ]"
    role="none"
  >
    <button
      ref="triggerRef"
      :class="ns.e('title')"
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      :aria-expanded="expanded"
      :disabled="disabled"
      :title="!showLabel ? title : undefined"
      @click="handleClick"
      @mouseenter="handleTriggerEnter"
      @mouseleave="handleTriggerLeave"
    >
      <BiliIcon v-if="icon" :class="ns.e('icon')" :name="icon" />
      <span v-if="showLabel" :class="ns.e('label')">
        <slot name="title">{{ title }}</slot>
      </span>
      <BiliIcon
        v-if="showLabel"
        :class="[ns.e('arrow'), ns.is('rotatable', !opensToSide)]"
        :name="arrowName"
      />
    </button>

    <ul v-if="isInline" v-show="opened" :class="[ns.e('inline'), ns.e('list')]" role="menu">
      <slot />
    </ul>

    <Teleport v-else to="body">
      <Transition name="bili-menu-popup">
        <ul
          v-if="popupVisible"
          ref="popupRef"
          :class="[ns.e('popup'), ns.e('list')]"
          :style="popupStyles"
          :data-placement="resolvedPlacement.split('-')[0]"
          role="menu"
          @mouseenter="handlePanelEnter"
          @mouseleave="handlePanelLeave"
        >
          <MenuPanelProvider :parent="menu">
            <slot />
          </MenuPanelProvider>
        </ul>
      </Transition>
    </Teleport>
  </li>
</template>
