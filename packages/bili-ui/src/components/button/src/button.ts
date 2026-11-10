import type { PropType } from 'vue'
import type { ComponentSize, ComponentType } from '../../../utils/types'

export type ButtonType = 'default' | ComponentType
export type ButtonNativeType = 'button' | 'submit' | 'reset'

export const buttonProps = {
  type: {
    type: String as PropType<ButtonType>,
    default: 'default'
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  plain: Boolean,
  round: Boolean,
  circle: Boolean,
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
  icon: {
    type: String,
    default: ''
  },
  nativeType: {
    type: String as PropType<ButtonNativeType>,
    default: 'button'
  }
} as const
