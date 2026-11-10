import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export const rateProps = {
  modelValue: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 5
  },
  allowHalf: Boolean,
  /** Clicking the same value clears the rating. */
  allowClear: {
    type: Boolean,
    default: true
  },
  disabled: Boolean,
  readonly: Boolean,
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  /** Active colour; defaults to the primary colour. */
  color: {
    type: String,
    default: ''
  },
  /** Colour of inactive stars. */
  voidColor: {
    type: String,
    default: ''
  },
  showText: Boolean,
  /** Text shown for each score, e.g. ['很差', '一般', '不错', '很好', '极佳']. */
  texts: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  icon: {
    type: String,
    default: 'star'
  }
} as const
