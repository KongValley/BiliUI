import type { PropType } from 'vue'

export const descriptionsProps = {
  title: {
    type: String,
    default: ''
  },
  /** Number of columns, or `auto` to fill available width. */
  column: {
    type: [Number, String] as PropType<number | 'auto'>,
    default: 3
  },
  /** Draw table borders. */
  bordered: Boolean,
  /** Total label width per column; `auto` sizes to content. */
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  /** Place labels above values instead of beside them. */
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal'
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md'
  }
} as const

export const descriptionsItemProps = {
  label: {
    type: String,
    default: ''
  },
  /** Columns spanned by this item. */
  span: {
    type: Number,
    default: 1
  },
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  }
} as const

export type DescriptionsProps = typeof descriptionsProps
export type DescriptionsItemProps = typeof descriptionsItemProps
