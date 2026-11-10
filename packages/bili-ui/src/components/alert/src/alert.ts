import type { PropType } from 'vue'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

export const alertProps = {
  type: {
    type: String as PropType<AlertType>,
    default: 'info'
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  /** Renders a border in the type colour. */
  bordered: Boolean,
  showIcon: Boolean,
  closable: Boolean,
  /** Controlled visibility; omit to let the component manage it. */
  visible: {
    type: Boolean,
    default: undefined
  }
} as const

export type AlertProps = typeof alertProps
