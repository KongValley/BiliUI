import type { PropType } from 'vue'

export const calendarProps = {
  /** Selected date as `YYYY-MM-DD`. */
  modelValue: {
    type: String,
    default: ''
  },
  /** 0 = Sunday, 1 = Monday. */
  firstDayOfWeek: {
    type: Number,
    default: 1
  },
  showToday: {
    type: Boolean,
    default: true
  },
  todayText: {
    type: String,
    default: ''
  },
  /** Return true to disable a date. */
  disabledDate: {
    type: Function as PropType<(date: Date) => boolean>,
    default: undefined
  }
} as const
