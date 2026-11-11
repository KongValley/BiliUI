import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export const timeSelectProps = {
  modelValue: {
    type: String,
    default: ''
  },
  /** First selectable time, `HH:mm`. */
  start: {
    type: String,
    default: '09:00'
  },
  /** Last selectable time, inclusive. */
  end: {
    type: String,
    default: '18:00'
  },
  /** Interval between options, `HH:mm`. */
  step: {
    type: String,
    default: '00:30'
  },
  /** Explicit option list; overrides start / end / step. */
  options: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  disabled: Boolean,
  clearable: {
    type: Boolean,
    default: true
  },
  popperClass: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: undefined
  }
} as const

export type TimeSelectProps = typeof timeSelectProps
