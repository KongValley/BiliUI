import type { PropType, CSSProperties } from 'vue'

export type CountdownValue = number | string | Date

export const countdownProps = {
  /** Target time: a millisecond timestamp, Date, or date string. */
  value: {
    type: [Number, String, Date] as PropType<CountdownValue>,
    default: 0
  },
  title: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  /** Supports `DD`, `HH`, `mm` and `ss` tokens. */
  format: {
    type: String,
    default: 'HH:mm:ss'
  },
  interval: {
    type: Number,
    default: 1000
  },
  autoStart: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: ''
  },
  valueStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined
  }
} as const

export type CountdownProps = typeof countdownProps
