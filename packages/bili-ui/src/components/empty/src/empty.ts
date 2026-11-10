import type { PropType } from 'vue'

export type EmptyPreset = 'default' | 'simple' | 'search' | 'data'

export const emptyProps = {
  /** Built-in illustration preset. */
  preset: {
    type: String as PropType<EmptyPreset>,
    default: 'default'
  },
  description: {
    type: String,
    default: ''
  },
  /** Renders a smaller, denser empty state. */
  small: Boolean
} as const

export type EmptyProps = typeof emptyProps
