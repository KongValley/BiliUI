import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export type CardShadow = 'always' | 'hover' | 'never'

export const cardProps = {
  title: {
    type: String,
    default: ''
  },
  extra: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  bordered: {
    type: Boolean,
    default: true
  },
  shadow: {
    type: String as PropType<CardShadow>,
    default: 'always'
  },
  hoverable: Boolean,
  loading: Boolean,
  /** Remove the inner padding, useful for tables and lists. */
  bodyFlush: Boolean
} as const
