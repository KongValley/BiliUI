import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export interface TableColumn {
  prop?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  formatter?: (row: any, column: TableColumn, value: any, index: number) => string
  slot?: string
  className?: string
}

export type TableSortOrder = 'asc' | 'desc' | null

export const tableProps = {
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  border: Boolean,
  stripe: Boolean,
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  loading: Boolean,
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  rowKey: {
    type: [String, Function] as PropType<string | ((row: any) => string | number)>,
    default: undefined
  }
} as const
