import type { PropType } from 'vue'

export const spaceCompactProps = {
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal'
  },
  /** Stretch the compact group to the full width of its container. */
  block: Boolean
} as const

export type SpaceCompactProps = typeof spaceCompactProps
