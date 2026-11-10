import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export const inputNumberProps = {
  modelValue: {
    type: Number,
    default: undefined
  },
  min: {
    type: Number,
    default: -Infinity
  },
  max: {
    type: Number,
    default: Infinity
  },
  step: {
    type: Number,
    default: 1
  },
  /** Decimal places kept when the value is committed. */
  precision: {
    type: Number,
    default: undefined
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  disabled: Boolean,
  /** Hide the stepper buttons. */
  controls: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  /** Formats the value for display without changing the model. */
  formatter: {
    type: Function as PropType<(value: number | undefined) => string>,
    default: undefined
  },
  /** Parses the formatted input back into a number. */
  parser: {
    type: Function as PropType<(value: string) => number>,
    default: undefined
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  }
} as const

export type InputNumberProps = typeof inputNumberProps
