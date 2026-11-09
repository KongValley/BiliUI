import { computed, ref, type Ref } from 'vue'
import type { TableColumn } from './table'

/** Stable identity for a column, used for reordering and width tracking. */
export const getColumnKey = (column: TableColumn, index: number): string =>
  column.prop || column.slot || `col-${index}`

export interface DragOptions {
  draggable: () => boolean
  resizable: () => boolean
  minWidth: () => number
  sensitivity: () => number
  onOrderChange: (order: string[]) => void
  onColumnResize: (key: string, width: number) => void
}

export function useTableDrag(
  columns: () => TableColumn[],
  headerRef: Ref<HTMLElement | null>,
  options: DragOptions
) {
  /** Column key order after user reordering. `null` means "natural order". */
  const order = ref<string[] | null>(null)
  /** Explicit widths in px, keyed by column key. Overrides `column.width`. */
  const widths = ref<Record<string, number>>({})

  const orderedColumns = computed<TableColumn[]>(() => {
    const list = columns()
    if (!order.value) return list
    const byKey = new Map<string, TableColumn>()
    list.forEach((column, index) => byKey.set(getColumnKey(column, index), column))
    const ordered = order.value
      .map(key => byKey.get(key))
      .filter((column): column is TableColumn => !!column)
    // Newly added columns that are not in the saved order go to the end.
    list.forEach((column, index) => {
      const key = getColumnKey(column, index)
      if (!order.value?.includes(key)) ordered.push(column)
    })
    return ordered
  })

  // ---------------------------------------------------------------- reorder

  const dragKey = ref<string | null>(null)
  const overKey = ref<string | null>(null)
  const dragging = ref(false)

  const startColumnDrag = (event: DragEvent, key: string) => {
    if (!options.draggable()) return
    dragKey.value = key
    dragging.value = true
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      // Firefox requires data to be set for drag to start.
      event.dataTransfer.setData('text/plain', key)
    }
  }

  const onColumnDragOver = (key: string) => {
    if (!dragKey.value || key === dragKey.value) return
    overKey.value = key
  }

  const finishColumnDrag = () => {
    const from = dragKey.value
    const to = overKey.value
    dragKey.value = null
    overKey.value = null
    dragging.value = false

    if (!from || !to || from === to) return

    const currentKeys = orderedColumns.value.map((column, index) =>
      getColumnKey(column, index)
    )
    const fromIndex = currentKeys.indexOf(from)
    const toIndex = currentKeys.indexOf(to)
    if (fromIndex === -1 || toIndex === -1) return

    const next = [...currentKeys]
    next.splice(fromIndex, 1)
    next.splice(toIndex, 0, from)
    order.value = next
    options.onOrderChange([...next])
  }

  const cancelColumnDrag = () => {
    dragKey.value = null
    overKey.value = null
    dragging.value = false
  }

  // ---------------------------------------------------------------- resizing

  const resizing = ref(false)
  const resizeKey = ref<string | null>(null)
  let startX = 0
  let startWidth = 0

  const readColumnWidth = (key: string): number => {
    const header = headerRef.value
    if (!header) return 0
    const cells = Array.from(header.querySelectorAll<HTMLElement>('th'))
    const keys = orderedColumns.value.map((column, index) => getColumnKey(column, index))
    const target = cells[keys.indexOf(key)]
    return target ? target.getBoundingClientRect().width : 0
  }

  const startResize = (event: PointerEvent, key: string) => {
    if (!options.resizable()) return
    event.preventDefault()
    event.stopPropagation()

    resizing.value = true
    resizeKey.value = key
    startX = event.clientX
    startWidth = widths.value[key] ?? readColumnWidth(key)

    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', stopResize, { once: true })
  }

  const onResizeMove = (event: PointerEvent) => {
    const key = resizeKey.value
    if (!key) return
    const delta = (event.clientX - startX) * options.sensitivity()
    const next = Math.max(options.minWidth(), Math.round(startWidth + delta))
    widths.value = { ...widths.value, [key]: next }
  }

  const stopResize = () => {
    const key = resizeKey.value
    resizing.value = false
    resizeKey.value = null
    window.removeEventListener('pointermove', onResizeMove)
    if (key && widths.value[key] !== undefined) {
      options.onColumnResize(key, widths.value[key])
    }
  }

  /** Width to apply to the col / th, preferring a user-resized value. */
  const getColumnWidth = (column: TableColumn, index: number): number | undefined => {
    const key = getColumnKey(column, index)
    if (widths.value[key] !== undefined) return widths.value[key]
    if (typeof column.width === 'number') return column.width
    return undefined
  }

  return {
    orderedColumns,
    getColumnWidth,
    dragging,
    dragKey,
    overKey,
    resizing,
    resizeKey,
    startColumnDrag,
    onColumnDragOver,
    finishColumnDrag,
    cancelColumnDrag,
    startResize
  }
}
