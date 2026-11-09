import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export interface TableColumn {
  /** Row property path, supports `a.b` nesting. Also identifies the column. */
  prop?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  /** Lock the column width so it cannot be resized by dragging the divider. */
  resizable?: boolean
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  /** Custom comparator; receives the two cell values. */
  sortMethod?: (a: any, b: any) => number
  formatter?: (row: any, column: TableColumn, value: any, index: number) => string
  slot?: string
  className?: string
}

export type TableSortOrder = 'asc' | 'desc' | null

export interface TableSortState {
  prop: string
  order: Exclude<TableSortOrder, null>
}

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
  },
  /** Allow dragging a header to reorder columns. */
  draggableColumns: Boolean,
  /** Allow dragging a header edge to resize the column. */
  resizableColumns: {
    type: Boolean,
    default: true
  },
  /** Width gained per pixel of drag. */
  resizeSensitivity: {
    type: Number,
    default: 1
  },
  /** Minimum column width in px. */
  minColumnWidth: {
    type: Number,
    default: 60
  },
  /** Sort more than one column at a time via Shift+click. */
  multiSort: Boolean
} as const
