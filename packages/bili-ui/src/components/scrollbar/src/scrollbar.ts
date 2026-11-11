import type { PropType } from 'vue'

export const scrollbarProps = {
  /** Fixed height of the scroll area. */
  height: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  /** Maximum height; the area grows with its content until this limit. */
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  /** Use the browser's native scrollbars instead of the custom ones. */
  native: Boolean,
  /** Keep the custom bars visible instead of showing them on hover. */
  always: Boolean,
  /** Minimum thumb length in px. */
  minSize: {
    type: Number,
    default: 24
  },
  /** Extra class on the scrolling wrapper. */
  wrapClass: {
    type: String,
    default: ''
  },
  /** Extra class on the inner view. */
  viewClass: {
    type: String,
    default: ''
  }
} as const
