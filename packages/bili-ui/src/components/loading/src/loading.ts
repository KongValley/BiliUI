import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export interface LoadingOptions {
  text?: string
  size?: ComponentSize
}

export type LoadingBinding = boolean | LoadingOptions

export const loadingProps = {
  text: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  fullscreen: Boolean,
  overlay: Boolean
} as const
