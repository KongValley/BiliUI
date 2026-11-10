import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export type DatePickerType = 'date' | 'daterange'
export type DatePickerValue = string | [string, string] | null

export interface DatePickerShortcut {
  text: string
  value: DatePickerValue | (() => DatePickerValue)
}

export const datePickerProps = {
  /** `YYYY-MM-DD` for a single date, `[start, end]` for a range. */
  modelValue: {
    type: [String, Array] as PropType<DatePickerValue>,
    default: null
  },
  type: {
    type: String as PropType<DatePickerType>,
    default: 'date'
  },
  placeholder: {
    type: String,
    default: ''
  },
  startPlaceholder: {
    type: String,
    default: ''
  },
  endPlaceholder: {
    type: String,
    default: ''
  },
  rangeSeparator: {
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
  /** 0 = Sunday, 1 = Monday. */
  firstDayOfWeek: {
    type: Number,
    default: 1
  },
  /** Return true to disable a date. */
  disabledDate: {
    type: Function as PropType<(date: Date) => boolean>,
    default: undefined
  },
  /** Quick options shown in the left column. */
  shortcuts: {
    type: Array as PropType<DatePickerShortcut[]>,
    default: () => []
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
