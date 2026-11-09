import type { PropType } from 'vue'

export type PaginationLayout =
  | 'total'
  | 'sizes'
  | 'prev'
  | 'pager'
  | 'next'
  | 'jumper'

export const paginationProps = {
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50, 100]
  },
  layout: {
    type: [String, Array] as PropType<string | string[]>,
    default: 'prev, pager, next'
  },
  pagerCount: {
    type: Number,
    default: 7
  },
  background: Boolean,
  small: Boolean,
  disabled: Boolean,
  hideOnSinglePage: Boolean
} as const
