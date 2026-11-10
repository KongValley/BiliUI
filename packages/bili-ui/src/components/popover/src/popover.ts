import type { PropType } from 'vue'
import type { Placement } from '@floating-ui/dom'

export const popoverProps = {
  /** Visible state when controlled. */
  visible: {
    type: Boolean,
    default: undefined
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'bottom'
  },
  trigger: {
    type: String as PropType<'hover' | 'click' | 'focus'>,
    default: 'click'
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 240
  },
  disabled: Boolean,
  /** Gap between trigger and popup, in px. */
  offset: {
    type: Number,
    default: 8
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  /** Extra class on the teleported content, useful for per-instance theming. */
  popperClass: {
    type: String,
    default: ''
  }
} as const

export const popconfirmProps = {
  ...popoverProps,
  trigger: {
    type: String as PropType<'hover' | 'click' | 'focus'>,
    default: 'click'
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  confirmType: {
    type: String as PropType<'primary' | 'danger'>,
    default: 'primary'
  },
  /** Shows a loading state and keeps the popup open until the promise settles. */
  onConfirm: {
    type: Function as PropType<() => void | Promise<unknown>>,
    default: undefined
  }
} as const

export type PopoverProps = typeof popoverProps
export type PopconfirmProps = typeof popconfirmProps
