import { computed, ref } from 'vue'
import { getProp } from '../../../utils/object'
import type { TableColumn, TableSortOrder, TableSortState } from './table'

export interface SortPayload {
  prop: string
  order: TableSortOrder
  /** Full sort state, in priority order. Empty when sorting is cleared. */
  sorts: TableSortState[]
}

export function useTableSort(
  columns: () => TableColumn[],
  multiSort: () => boolean,
  onChange: (payload: SortPayload) => void
) {
  const sorts = ref<TableSortState[]>([])

  /** Sort priority for a column: 1-based, or 0 when not sorted. */
  const getSortPriority = (prop?: string): number => {
    if (!prop) return 0
    const index = sorts.value.findIndex(item => item.prop === prop)
    return index > -1 ? index + 1 : 0
  }

  const getSortOrder = (prop?: string): TableSortOrder => {
    if (!prop) return null
    return sorts.value.find(item => item.prop === prop)?.order ?? null
  }

  const cycle = (order: TableSortOrder): TableSortOrder =>
    order === null ? 'asc' : order === 'asc' ? 'desc' : null

  /**
   * Click behaviour:
   * - plain click: replace the whole sort with this column
   * - Shift+click (multi sort on): toggle this column, keep the others
   */
  const toggleSort = (column: TableColumn, additive: boolean) => {
    if (!column.sortable || !column.prop) return
    const prop = column.prop
    const currentOrder = getSortOrder(prop)
    const nextOrder = cycle(currentOrder)

    const others = sorts.value.filter(item => item.prop !== prop)
    const keepAdditive = additive && multiSort()

    let next: TableSortState[]
    if (nextOrder === null) {
      next = keepAdditive ? others : []
    } else if (keepAdditive) {
      // Newly added columns append so earlier clicks keep higher priority.
      next = [...others, { prop, order: nextOrder }]
    } else {
      next = [{ prop, order: nextOrder }]
    }

    sorts.value = next
    onChange({
      prop,
      order: nextOrder,
      sorts: next.map(item => ({ ...item }))
    })
  }

  const clearSort = () => {
    sorts.value = []
  }

  const sortedData = <T extends Record<string, any>>(data: T[]): T[] => {
    if (!sorts.value.length) return data

    const sortedColumns = sorts.value
      .map(state => ({ state, column: columns().find(c => c.prop === state.prop) }))
      .filter(item => item.column)

    if (!sortedColumns.length) return data

    return [...data].sort((left, right) => {
      for (const { state, column } of sortedColumns) {
        const result = compareValues(
          getProp(left, state.prop),
          getProp(right, state.prop),
          state.order,
          column?.sortMethod
        )
        if (result !== 0) return result
      }
      return 0
    })
  }

  const sortState = computed(() =>
    sorts.value.map(item => ({ ...item }))
  )

  return {
    sorts: sortState,
    getSortPriority,
    getSortOrder,
    toggleSort,
    clearSort,
    sortedData
  }
}

/** Shared comparison so multi-column sorting stays consistent per column. */
function compareValues(
  leftValue: any,
  rightValue: any,
  order: Exclude<TableSortOrder, null>,
  sortMethod?: (a: any, b: any) => number
): number {
  if (leftValue === rightValue) return 0

  const direction = order === 'asc' ? 1 : -1

  // Empty values always sink to the bottom regardless of direction.
  const leftEmpty = leftValue === null || leftValue === undefined || leftValue === ''
  const rightEmpty = rightValue === null || rightValue === undefined || rightValue === ''
  if (leftEmpty && rightEmpty) return 0
  if (leftEmpty) return 1
  if (rightEmpty) return -1

  if (sortMethod) return sortMethod(leftValue, rightValue) * direction

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return (leftValue - rightValue) * direction
  }

  return String(leftValue).localeCompare(String(rightValue), 'zh-CN') * direction
}
