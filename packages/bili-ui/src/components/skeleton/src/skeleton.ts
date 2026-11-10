import type { PropType } from 'vue'

export type SkeletonVariant = 'text' | 'circle' | 'image' | 'rect' | 'button'

export const skeletonProps = {
  /** Render the placeholder instead of the slot content. */
  loading: {
    type: Boolean,
    default: true
  },
  /** Number of text rows. */
  rows: {
    type: Number,
    default: 3
  },
  /** Shows a leading avatar-shaped placeholder. */
  avatar: Boolean,
  /** Sweeping highlight. */
  animated: Boolean,
  /** Renders a title row that is wider than the body rows. */
  title: {
    type: Boolean,
    default: true
  }
} as const

export const skeletonItemProps = {
  variant: {
    type: String as PropType<SkeletonVariant>,
    default: 'text'
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  size: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  }
} as const

export type SkeletonProps = typeof skeletonProps
export type SkeletonItemProps = typeof skeletonItemProps
