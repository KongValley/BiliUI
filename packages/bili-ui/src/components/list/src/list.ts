import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export type ListKey = string | number
export type ListRowKey = string | ((item: any, index: number) => ListKey)

export const listProps = {
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  /** Field name or resolver used as the item key. */
  rowKey: {
    type: [String, Function] as PropType<ListRowKey>,
    default: undefined
  },
  header: {
    type: String,
    default: ''
  },
  footer: {
    type: String,
    default: ''
  },
  bordered: Boolean,
  /** Draw a divider between items. */
  split: {
    type: Boolean,
    default: true
  },
  hoverable: Boolean,
  loading: Boolean,
  emptyText: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  }
} as const
