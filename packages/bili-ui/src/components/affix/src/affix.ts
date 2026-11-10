import type { PropType } from 'vue'

export const affixProps = {
  /** Distance kept from the viewport edge when fixed. */
  offset: {
    type: Number,
    default: 0
  },
  position: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'top'
  },
  /** Boundary container element or selector. Defaults to the viewport. */
  target: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: undefined
  },
  zIndex: {
    type: Number,
    default: 100
  }
} as const
