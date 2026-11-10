import type { PropType } from 'vue'
import type { ComponentType } from '../../../utils/types'

export const timelineProps = {
  /** Render items from bottom to top. */
  reverse: Boolean
} as const

export const timelineItemProps = {
  timestamp: {
    type: String,
    default: ''
  },
  /** Semantic dot colour. */
  type: {
    type: String as PropType<ComponentType>,
    default: 'primary'
  },
  /** Custom dot colour, overrides `type`. */
  color: {
    type: String,
    default: ''
  },
  /** Built-in icon rendered inside the dot. */
  icon: {
    type: String,
    default: ''
  },
  /** Hollow dot with a coloured border. */
  hollow: Boolean
} as const
