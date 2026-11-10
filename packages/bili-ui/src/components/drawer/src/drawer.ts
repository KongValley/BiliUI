import type { PropType } from 'vue'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export const drawerProps = {
  modelValue: Boolean,
  title: {
    type: String,
    default: ''
  },
  placement: {
    type: String as PropType<DrawerPlacement>,
    default: 'right'
  },
  /** Width for left/right drawers, height for top/bottom drawers. */
  size: {
    type: [String, Number] as PropType<string | number>,
    default: 360
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  /** Extra class on the teleported overlay. */
  overlayClass: {
    type: String,
    default: ''
  },
  /** Extra class on the drawer panel, useful for per-instance theming. */
  panelClass: {
    type: String,
    default: ''
  }
} as const

export type DrawerProps = typeof drawerProps
