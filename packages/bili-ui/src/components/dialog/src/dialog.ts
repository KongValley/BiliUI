import type { PropType } from 'vue'

export const dialogProps = {
  modelValue: Boolean,
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 480
  },
  top: {
    type: [String, Number] as PropType<string | number>,
    default: '15vh'
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
  /** Extra class on the dialog panel, useful for per-instance theming. */
  panelClass: {
    type: String,
    default: ''
  }
} as const
