import type { PropType } from 'vue'

export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch'
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'

export const rowProps = {
  /** Total columns in the grid. */
  gutter: {
    type: [Number, Array] as PropType<number | [number, number]>,
    default: 0
  },
  justify: {
    type: String as PropType<RowJustify>,
    default: 'start'
  },
  align: {
    type: String as PropType<RowAlign>,
    default: 'top'
  },
  wrap: {
    type: Boolean,
    default: true
  }
} as const

export const colProps = {
  /** Column span of the 24-column grid. */
  span: {
    type: Number,
    default: 24
  },
  offset: {
    type: Number,
    default: 0
  },
  push: {
    type: Number,
    default: 0
  },
  pull: {
    type: Number,
    default: 0
  },
  /** `xs` < 576px, `sm` ≥ 576px, `md` ≥ 768px, `lg` ≥ 992px, `xl` ≥ 1200px */
  xs: {
    type: [Number, Object] as PropType<number | { span?: number; offset?: number }>,
    default: undefined
  },
  sm: {
    type: [Number, Object] as PropType<number | { span?: number; offset?: number }>,
    default: undefined
  },
  md: {
    type: [Number, Object] as PropType<number | { span?: number; offset?: number }>,
    default: undefined
  },
  lg: {
    type: [Number, Object] as PropType<number | { span?: number; offset?: number }>,
    default: undefined
  },
  xl: {
    type: [Number, Object] as PropType<number | { span?: number; offset?: number }>,
    default: undefined
  }
} as const
