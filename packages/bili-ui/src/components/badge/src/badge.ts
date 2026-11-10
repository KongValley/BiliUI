import type { PropType } from 'vue'

export type BadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'

export const badgeProps = {
  /** Badge content: a number, or any text such as `NEW`. */
  value: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  /** Caps numeric values, rendering `max+` beyond the limit. */
  max: {
    type: Number,
    default: 99
  },
  /** Shows a bare dot instead of content. */
  dot: Boolean,
  /** Hides the badge entirely while keeping the layout. */
  hidden: Boolean,
  /** Shows the badge when the value is exactly 0. */
  showZero: Boolean,
  type: {
    type: String as PropType<BadgeType>,
    default: 'danger'
  },
  /** Renders a status dot with a trailing label. */
  status: {
    type: String as PropType<BadgeStatus>,
    default: undefined
  },
  /** Custom badge colour, overrides `type`. */
  color: {
    type: String,
    default: ''
  }
} as const

export type BadgeProps = typeof badgeProps
