import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export const inputOtpProps = {
  modelValue: {
    type: String,
    default: ''
  },
  length: {
    type: Number,
    default: 6
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  disabled: Boolean,
  /** Hide the entered characters. */
  mask: Boolean,
  /** Number or text rendered between every cell. */
  separator: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  /** Keyboard hint for the cells. */
  type: {
    type: String as PropType<'text' | 'number'>,
    default: 'text'
  }
} as const

export type InputOtpProps = typeof inputOtpProps
