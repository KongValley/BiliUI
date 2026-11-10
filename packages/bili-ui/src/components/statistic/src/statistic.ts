import type { PropType, CSSProperties } from 'vue'

export type StatisticValue = number | string

export const statisticProps = {
  title: {
    type: String,
    default: ''
  },
  value: {
    type: [Number, String] as PropType<StatisticValue>,
    default: 0
  },
  /** Number of digits kept after the decimal point. */
  precision: {
    type: Number,
    default: undefined
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  groupSeparator: {
    type: String,
    default: ','
  },
  decimalSeparator: {
    type: String,
    default: '.'
  },
  /** Full control over the rendered value. */
  formatter: {
    type: Function as PropType<(value: StatisticValue) => string>,
    default: undefined
  },
  /** Colour of the value text. */
  color: {
    type: String,
    default: ''
  },
  valueStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined
  }
} as const
