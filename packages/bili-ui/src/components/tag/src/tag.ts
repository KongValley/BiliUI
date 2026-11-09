import type { PropType } from 'vue'
import type { ComponentSize, ComponentType } from '../../../utils/types'

export type TagType = 'default' | ComponentType
export type TagEffect = 'light' | 'dark' | 'plain'

export const tagProps = {
  type: {
    type: String as PropType<TagType>,
    default: 'default'
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  effect: {
    type: String as PropType<TagEffect>,
    default: 'light'
  },
  closable: Boolean,
  round: Boolean
} as const
