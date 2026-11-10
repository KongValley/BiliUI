import type { PropType } from 'vue'

export const backTopProps = {
  /** Scroll container element or selector. Defaults to the window. */
  target: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: undefined
  },
  /** Scroll distance after which the button appears. */
  visibilityHeight: {
    type: Number,
    default: 200
  },
  right: {
    type: [String, Number] as PropType<string | number>,
    default: 40
  },
  bottom: {
    type: [String, Number] as PropType<string | number>,
    default: 40
  },
  /** Scroll-back animation duration in milliseconds; `0` jumps instantly. */
  duration: {
    type: Number,
    default: 450
  },
  zIndex: {
    type: Number,
    default: 100
  }
} as const
