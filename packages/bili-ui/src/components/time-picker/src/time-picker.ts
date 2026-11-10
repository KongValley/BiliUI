import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export const timePickerProps = {
  /** `HH:mm` or `HH:mm:ss` string. */
  modelValue: {
    type: String,
    default: ''
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
  /** Show the seconds column and emit `HH:mm:ss`. */
  showSeconds: Boolean,
  hourStep: {
    type: Number,
    default: 1
  },
  minuteStep: {
    type: Number,
    default: 1
  },
  secondStep: {
    type: Number,
    default: 1
  },
  /** Hours disabled in the column. */
  disabledHours: {
    type: Function as PropType<() => number[]>,
    default: undefined
  },
  /** Minutes disabled for the selected hour. */
  disabledMinutes: {
    type: Function as PropType<(hour: number) => number[]>,
    default: undefined
  },
  /** Seconds disabled for the selected hour/minute. */
  disabledSeconds: {
    type: Function as PropType<(hour: number, minute: number) => number[]>,
    default: undefined
  },
  nowText: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: ''
  },
  /** Extra class on the teleported panel. */
  popperClass: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: undefined
  }
} as const
