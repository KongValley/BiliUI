<script setup lang="ts">
import { computed, onMounted, ref, watch, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { formatLocale, useLocale } from '../../../hooks/use-config'
import { addUnit } from '../../../utils/dom'
import { getProp } from '../../../utils/object'
import BiliIcon from '../../icon/src/icon.vue'
import BiliCheckbox from '../../checkbox/src/checkbox.vue'
import { vLoading } from '../../loading/src/directive'
import { tableProps, type TableColumn, type TableRowKey } from './table'
import { useTableSort, type SortPayload } from './use-table-sort'
import { getColumnKey, useTableDrag } from './use-table-drag'
import { useTableSelection, type SelectionPayload } from './use-table-selection'

defineOptions({ name: 'BiliTable' })

const props = defineProps(tableProps)

const emit = defineEmits<{
  'sort-change': [payload: SortPayload]
  'column-order-change': [order: string[]]
  'column-resize': [key: string, width: number]
  'update:selectedKeys': [keys: Array<string | number>]
  'selection-change': [payload: SelectionPayload]
  select: [payload: SelectionPayload]
  'select-all': [payload: SelectionPayload]
  'update:expandedKeys': [keys: TableRowKey[]]
  'update:expandedRowKeys': [keys: TableRowKey[]]
  'expand-change': [row: any, expanded: boolean]
  'expand-row-change': [row: any, expanded: boolean]
}>()

const ns = useNamespace('table')
const locale = useLocale()
const displayEmpty = computed(() => props.emptyText || locale.value.empty)
const displaySummaryText = computed(() => props.summaryText || locale.value.sumText)

const headerRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)

const { sorts, getSortPriority, getSortOrder, toggleSort, sortedData } = useTableSort(
  () => props.columns,
  () => props.multiSort,
  payload => emit('sort-change', payload)
)

const {
  orderedColumns,
  getColumnWidth,
  dragging,
  dragKey,
  overKey,
  resizing,
  startColumnDrag,
  onColumnDragOver,
  finishColumnDrag,
  cancelColumnDrag,
  startResize
} = useTableDrag(
  () => props.columns,
  headerRef,
  {
    draggable: () => props.draggableColumns,
    resizable: () => props.resizableColumns,
    minWidth: () => props.minColumnWidth,
    sensitivity: () => props.resizeSensitivity,
    onOrderChange: order => emit('column-order-change', order),
    onColumnResize: (key, width) => emit('column-resize', key, width)
  }
)

const getValue = (row: any, column: TableColumn) =>
  column.prop ? getProp(row, column.prop) : undefined
const getCellText = (row: any, column: TableColumn, index: number): string => {
  const value = getValue(row, column)
  if (column.formatter) return column.formatter(row, column, value, index)
  return value === undefined || value === null ? '' : String(value)
}

const getCellSlot = (column: TableColumn, index: number): string =>
  `cell-${column.slot ?? column.prop ?? index}`

const getHeaderSlot = (column: TableColumn, index: number): string =>
  `header-${column.prop ?? index}`

const getRowKey = (row: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  if (typeof props.rowKey === 'string') return getProp(row, props.rowKey) ?? index
  return index
}

/** Keys stay unique across tree levels even when no `row-key` is provided. */
const resolveRowKey = (
  row: any,
  index: number,
  parentKey?: TableRowKey
): TableRowKey => {
  if (props.rowKey) return getRowKey(row, index)
  return parentKey !== undefined ? `${parentKey}.${index}` : index
}

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

const selectionState = useTableSelection({
  data: () => props.data,
  rowKey: () => props.rowKey,
  selectedKeys: () => props.selectedKeys,
  selectable: () => props.selectable,
  onChange: payload => {
    emit('update:selectedKeys', payload.keys)
    emit('selection-change', payload)
  },
  onUpdateKeys: () => undefined
})

const handleRowToggle = (row: any, index: number, checked?: boolean) => {
  if (!props.selection) return
  // `toggleRow` returns the resulting payload; re-reading the selection here
  // would still see the stale value while a v-model update is in flight.
  const payload = selectionState.toggleRow(row, index, checked)
  if (!payload) return
  emit('select', payload)
}

const handleSelectAll = (checked?: boolean) => {
  if (!props.selection) return
  emit('select-all', selectionState.toggleAll(checked))
}

const handleRowClick = (event: MouseEvent, row: any, index: number) => {
  if (!props.selection || !props.selectOnClickRow) return
  // Clicks on interactive elements inside the row keep their own behaviour.
  const target = event.target as HTMLElement | null
  if (target?.closest('input, button, a, label, select, textarea')) return
  handleRowToggle(row, index)
}

defineExpose({
  clearSelection: selectionState.clearSelection,
  selectedRows: selectionState.selectedRows,
  toggleAllSelection: selectionState.toggleAll,
  toggleRowExpansion
})

// ---------------------------------------------------------------------------
// Tree data + row expansion
// ---------------------------------------------------------------------------

const treeChildrenKey = computed(() => props.treeProps.children ?? 'children')
const treeHasChildrenKey = computed(() => props.treeProps.hasChildren)
const hasTree = computed(() =>
  props.data.some(row => Array.isArray(getProp(row, treeChildrenKey.value)))
)

const innerTreeExpanded = ref<TableRowKey[]>([])
const innerExpandedRows = ref<TableRowKey[]>([])

const treeExpandedKeys = computed(() => props.expandedKeys ?? innerTreeExpanded.value)
const expandedRowKeys = computed(() => props.expandedRowKeys ?? innerExpandedRows.value)
const treeExpandedSet = computed(() => new Set(treeExpandedKeys.value))
const expandedRowSet = computed(() => new Set(expandedRowKeys.value))

const collectDefaultKeys = () => {
  const treeKeys: TableRowKey[] = []
  const rowKeys: TableRowKey[] = []

  const walk = (rows: any[], parentKey?: TableRowKey) => {
    rows.forEach((row, index) => {
      const key = resolveRowKey(row, index, parentKey)
      const children = getProp(row, treeChildrenKey.value)
      if (Array.isArray(children) && children.length) {
        treeKeys.push(key)
        walk(children, key)
      }
      if (props.expandable && (!props.rowExpandable || props.rowExpandable(row, index))) {
        rowKeys.push(key)
      }
    })
  }

  walk(props.data)
  return { treeKeys, rowKeys }
}

const expandAll = () => {
  const { treeKeys, rowKeys } = collectDefaultKeys()
  if (props.expandedKeys === undefined) innerTreeExpanded.value = treeKeys
  if (props.expandedRowKeys === undefined) innerExpandedRows.value = rowKeys
}

onMounted(() => {
  if (props.defaultExpandAll) expandAll()
})

watch(
  () => props.defaultExpandAll,
  enabled => {
    if (enabled) expandAll()
  }
)

watch(
  () => props.data,
  () => {
    if (props.defaultExpandAll) expandAll()
  }
)

const toggleTree = (item: DisplayRow) => {
  const expanded = !treeExpandedSet.value.has(item.key)
  const next = expanded
    ? [...treeExpandedSet.value, item.key]
    : treeExpandedKeys.value.filter(key => key !== item.key)
  if (props.expandedKeys === undefined) innerTreeExpanded.value = next
  emit('update:expandedKeys', next)
  emit('expand-change', item.row, expanded)
}

const toggleExpandRow = (item: DisplayRow, expanded?: boolean) => {
  const nextValue = expanded ?? !expandedRowSet.value.has(item.key)
  const next = nextValue
    ? [...new Set([...expandedRowSet.value, item.key])]
    : expandedRowKeys.value.filter(key => key !== item.key)
  if (props.expandedRowKeys === undefined) innerExpandedRows.value = next
  emit('update:expandedRowKeys', next)
  emit('expand-row-change', item.row, nextValue)
}

// ---------------------------------------------------------------------------
// Display rows (sort → flatten tree → virtual window)
// ---------------------------------------------------------------------------

interface DisplayRow {
  row: any
  key: TableRowKey
  level: number
  parentKey?: TableRowKey
  isTreeParent: boolean
  isDetailExpandable: boolean
  index: number
}

const sortedRows = computed<any[]>(() => {
  const sortLevel = (rows: any[]): any[] => {
    const sorted = sortedData(rows)
    if (!hasTree.value) return sorted
    return sorted.map(row => {
      const children = getProp(row, treeChildrenKey.value)
      if (!Array.isArray(children) || !children.length) return row
      return { ...row, [treeChildrenKey.value]: sortLevel(children) }
    })
  }
  return sortLevel(props.data)
})

const displayRows = computed<DisplayRow[]>(() => {
  const result: DisplayRow[] = []

  const walk = (rows: any[], level: number, parentKey?: TableRowKey) => {
    rows.forEach((row, index) => {
      const key = resolveRowKey(row, index, parentKey)
      const children = getProp(row, treeChildrenKey.value)
      const hasChildren = Array.isArray(children) && children.length > 0
      const lazyChildren = treeHasChildrenKey.value
        ? !!getProp(row, treeHasChildrenKey.value)
        : false
      const isDetailExpandable =
        props.expandable && (!props.rowExpandable || props.rowExpandable(row, index))

      result.push({
        row,
        key,
        level,
        parentKey,
        isTreeParent: hasChildren || lazyChildren,
        isDetailExpandable,
        index
      })

      if (hasChildren && treeExpandedSet.value.has(key)) {
        walk(children, level + 1, key)
      }
    })
  }

  walk(sortedRows.value, 0)
  return result
})

function toggleRowExpansion(row: any, expanded?: boolean) {
  const index = props.data.indexOf(row)
  const item = displayRows.value.find(
    entry => entry.row === row || entry.key === resolveRowKey(row, index)
  )
  if (item) toggleExpandRow(item, expanded)
}

const maxHeightValue = computed(() =>
  props.maxHeight ?? (props.virtual ? 400 : undefined)
)

const wrapperStyle = computed<CSSProperties>(() => ({
  maxHeight: maxHeightValue.value !== undefined ? addUnit(maxHeightValue.value) : undefined,
  overflowY: maxHeightValue.value !== undefined ? 'auto' : undefined
}))

const canVirtual = computed(
  () => props.virtual && !hasTree.value && !props.expandable && displayRows.value.length > 0
)

const scrollTop = ref(0)
const virtualOverscan = 2

const virtualViewportRows = computed(() => {
  const raw = maxHeightValue.value
  const height = typeof raw === 'number' ? raw : Number.parseFloat(String(raw)) || 400
  return Math.ceil(height / props.virtualRowHeight)
})

const virtualStart = computed(() => {
  if (!canVirtual.value) return 0
  return Math.max(0, Math.floor(scrollTop.value / props.virtualRowHeight) - virtualOverscan)
})

const virtualEnd = computed(() => {
  if (!canVirtual.value) return displayRows.value.length
  return Math.min(
    displayRows.value.length,
    virtualStart.value + virtualViewportRows.value + virtualOverscan * 2
  )
})

const renderedRows = computed(() => displayRows.value.slice(virtualStart.value, virtualEnd.value))

/** Index within the full data set, even when the virtual window starts later. */
const rowIndexAt = (index: number) => (canVirtual.value ? virtualStart.value + index : index)

const topSpacerHeight = computed(() => virtualStart.value * props.virtualRowHeight)
const bottomSpacerHeight = computed(
  () => (displayRows.value.length - virtualEnd.value) * props.virtualRowHeight
)

const handleScroll = (event: Event) => {
  if (canVirtual.value) scrollTop.value = (event.target as HTMLElement).scrollTop
}

// ---------------------------------------------------------------------------
// Fixed columns
// ---------------------------------------------------------------------------

interface FixedPosition {
  left?: number
  right?: number
  lastLeft?: boolean
  firstRight?: boolean
}

const hasFixedLeft = computed(() => orderedColumns.value.some(column => column.fixed === 'left'))
const hasFixedRight = computed(() => orderedColumns.value.some(column => column.fixed === 'right'))

const leadingWidth = computed(
  () => (props.expandable ? props.expandWidth : 0) + (props.selection ? props.selectionWidth : 0)
)

const columnPixelWidth = (column: TableColumn, index: number): number => {
  const width = getColumnWidth(column, index)
  if (typeof width === 'number') return width
  if (typeof column.width === 'number') return column.width
  if (typeof column.width === 'string') {
    const parsed = Number.parseFloat(column.width)
    if (!Number.isNaN(parsed)) return parsed
  }
  return column.fixed ? 120 : 0
}

const columnDisplayWidth = (column: TableColumn, index: number): string | number | undefined => {
  const width = getColumnWidth(column, index)
  if (width !== undefined) return width
  if (column.width !== undefined) return column.width
  return column.fixed ? 120 : undefined
}

const fixedPositions = computed(() => {
  const map = new Map<string, FixedPosition>()
  const leftKeys: string[] = []

  if (hasFixedLeft.value) {
    let offset = leadingWidth.value
    orderedColumns.value.forEach((column, index) => {
      if (column.fixed !== 'left') return
      const key = getColumnKey(column, index)
      map.set(key, { left: offset })
      leftKeys.push(key)
      offset += columnPixelWidth(column, index) || 120
    })
    const lastKey = leftKeys[leftKeys.length - 1]
    if (lastKey) map.set(lastKey, { ...map.get(lastKey), lastLeft: true })
  }

  if (hasFixedRight.value) {
    let offset = 0
    let firstKey = ''
    for (let index = orderedColumns.value.length - 1; index >= 0; index -= 1) {
      const column = orderedColumns.value[index]
      if (column.fixed !== 'right') continue
      const key = getColumnKey(column, index)
      map.set(key, { ...map.get(key), right: offset })
      firstKey = key
      offset += columnPixelWidth(column, index) || 120
    }
    if (firstKey) map.set(firstKey, { ...map.get(firstKey), firstRight: true })
  }

  return map
})

const fixedStyle = (column: TableColumn, index: number): CSSProperties => {
  const fixed = fixedPositions.value.get(getColumnKey(column, index))
  if (!fixed) return {}
  const style: CSSProperties = { position: 'sticky' }
  if (fixed.left !== undefined) style.left = `${fixed.left}px`
  if (fixed.right !== undefined) style.right = `${fixed.right}px`
  return style
}

const fixedClasses = (column: TableColumn, index: number): string[] => {
  const fixed = fixedPositions.value.get(getColumnKey(column, index))
  if (!fixed) return []
  return [
    fixed.left !== undefined ? ns.is('fixed-left', true) : '',
    fixed.right !== undefined ? ns.is('fixed-right', true) : '',
    fixed.lastLeft ? ns.is('fixed-left-last', true) : '',
    fixed.firstRight ? ns.is('fixed-right-first', true) : ''
  ].filter(Boolean)
}

const leadingStyle = (kind: 'expand' | 'selection'): CSSProperties | undefined => {
  if (!hasFixedLeft.value) return undefined
  return {
    position: 'sticky',
    left: `${kind === 'expand' ? 0 : props.expandable ? props.expandWidth : 0}px`
  }
}

// Width lives on <col> so header and body stay in sync; the header only needs
// alignment and a min-width guard.
const columnStyle = (column: TableColumn, index: number): CSSProperties => {
  const width = columnDisplayWidth(column, index)
  return {
    ...fixedStyle(column, index),
    minWidth: column.minWidth !== undefined ? addUnit(column.minWidth) : undefined,
    textAlign: column.align ?? 'left',
    width: width !== undefined ? addUnit(width) : undefined
  }
}

const cellStyle = (column: TableColumn, columnIndex: number, item: DisplayRow): CSSProperties => ({
  textAlign: column.align ?? 'left',
  paddingLeft:
    columnIndex === 0
      ? `${12 + item.level * props.indentSize}px`
      : undefined,
  ...fixedStyle(column, columnIndex)
})

const handleSort = (column: TableColumn, event: MouseEvent) => {
  // A header drag should never trigger a sort.
  if (dragging.value) return
  toggleSort(column, event.shiftKey)
}

const canResize = (column: TableColumn) =>
  props.resizableColumns && column.resizable !== false

const columnKeyAt = (column: TableColumn, index: number) => getColumnKey(column, index)

const colspan = computed(
  () => orderedColumns.value.length + (props.selection ? 1 : 0) + (props.expandable ? 1 : 0)
)

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const summaryValues = computed<Array<string | number | null | undefined>>(() => {
  if (!props.showSummary) return []
  if (props.summaryMethod) {
    return props.summaryMethod({ columns: orderedColumns.value, data: props.data })
  }
  return orderedColumns.value.map((column, index) => {
    if (index === 0) return displaySummaryText.value
    if (!column.prop) return ''
    const numbers = props.data
      .map(row => getProp(row, column.prop as string))
      .filter((value): value is number => typeof value === 'number')
    return numbers.length ? numbers.reduce((total, value) => total + value, 0) : ''
  })
})
</script>

<template>
  <div
    v-loading="loading"
    :class="[
      ns.b(),
      ns.m(size),
      ns.is('border', border),
      ns.is('stripe', stripe),
      ns.is('draggable', draggableColumns),
      ns.is('resizing', resizing),
      ns.is('expandable', expandable),
      ns.is('virtual', canVirtual)
    ]"
  >
    <div
      ref="wrapperRef"
      :class="ns.e('wrapper')"
      :style="wrapperStyle"
      @scroll="handleScroll"
    >
      <table :class="ns.e('inner')" cellspacing="0" cellpadding="0">
        <colgroup>
          <col v-if="expandable" :style="{ width: addUnit(expandWidth) }" />
          <col v-if="selection" :style="{ width: addUnit(selectionWidth) }" />
          <col
            v-for="(column, index) in orderedColumns"
            :key="columnKeyAt(column, index)"
            :style="{ width: addUnit(columnDisplayWidth(column, index)) }"
          />
        </colgroup>

        <thead ref="headerRef" :class="ns.e('head')">
          <tr>
            <th
              v-if="expandable"
              :class="[
                ns.e('cell'),
                ns.e('expand-cell'),
                ns.is('fixed-left', hasFixedLeft),
                ns.is('fixed-leading', hasFixedLeft)
              ]"
              :style="leadingStyle('expand')"
            />
            <th
              v-if="selection"
              :class="[
                ns.e('cell'),
                ns.e('selection-cell'),
                ns.is('fixed-left', hasFixedLeft),
                ns.is('fixed-leading', hasFixedLeft)
              ]"
              :style="leadingStyle('selection')"
            >
              <BiliCheckbox
                :model-value="selectionState.allSelected.value"
                :indeterminate="selectionState.partiallySelected.value"
                :disabled="!selectionState.selectableRows.value.length"
                :aria-label="locale.selectAll"
                @change="checked => handleSelectAll(checked)"
              />
            </th>
            <th
              v-for="(column, index) in orderedColumns"
              :key="columnKeyAt(column, index)"
              :class="[
                ns.e('cell'),
                ns.is('sortable', column.sortable),
                ns.is('sorted', !!getSortOrder(column.prop)),
                ns.is('dragging', dragKey === columnKeyAt(column, index)),
                ns.is('drag-over', overKey === columnKeyAt(column, index)),
                ...fixedClasses(column, index),
                column.className
              ]"
              :style="columnStyle(column, index)"
              :draggable="draggableColumns ? 'true' : undefined"
              :aria-sort="
                getSortOrder(column.prop)
                  ? getSortOrder(column.prop) === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              "
              @click="handleSort(column, $event)"
              @dragstart="startColumnDrag($event, columnKeyAt(column, index))"
              @dragover.prevent="onColumnDragOver(columnKeyAt(column, index))"
              @drop.prevent="finishColumnDrag"
              @dragend="finishColumnDrag"
              @dragleave="cancelColumnDrag"
            >
              <span :class="ns.e('cell-label')">
                <slot :name="getHeaderSlot(column, index)" :column="column">
                  {{ column.label ?? '' }}
                </slot>
              </span>

              <span v-if="column.sortable" :class="ns.e('sorter')">
                <span :class="ns.e('sorter-icons')">
                  <BiliIcon
                    :class="[
                      ns.e('sort-icon'),
                      ns.is('asc', getSortOrder(column.prop) === 'asc')
                    ]"
                    name="chevron-up"
                  />
                  <BiliIcon
                    :class="[
                      ns.e('sort-icon'),
                      ns.is('desc', getSortOrder(column.prop) === 'desc')
                    ]"
                    name="chevron-down"
                  />
                </span>
                <span
                  v-if="multiSort && getSortPriority(column.prop) > 0 && sorts.length > 1"
                  :class="ns.e('sort-index')"
                  :aria-label="
                    formatLocale(locale.sortPriority, {
                      priority: getSortPriority(column.prop)
                    })
                  "
                >
                  {{ getSortPriority(column.prop) }}
                </span>
              </span>

              <span
                v-if="canResize(column)"
                :class="[ns.e('resize-handle'), ns.is('active', resizing)]"
                role="separator"
                aria-orientation="vertical"
                  :aria-label="
                    formatLocale(locale.resizeColumn, { column: column.label ?? '' })
                  "
                @pointerdown="startResize($event, columnKeyAt(column, index))"
                @click.stop
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="canVirtual && topSpacerHeight > 0" :class="ns.e('spacer-row')" aria-hidden="true">
            <td :colspan="colspan" :style="{ height: `${topSpacerHeight}px` }" />
          </tr>

          <template v-for="(item, rowIndex) in renderedRows" :key="item.key">
            <tr
              :class="[
                ns.e('row'),
                ns.is('selected', selectionState.isSelected(item.row, rowIndexAt(rowIndex))),
                ns.is('selectable', selectionState.isSelectable(item.row, rowIndexAt(rowIndex)))
              ]"
              @click="handleRowClick($event, item.row, rowIndexAt(rowIndex))"
            >
              <td
                v-if="expandable"
                :class="[
                  ns.e('cell'),
                  ns.e('expand-cell'),
                  ns.is('fixed-left', hasFixedLeft),
                  ns.is('fixed-leading', hasFixedLeft)
                ]"
                :style="leadingStyle('expand')"
              >
                <button
                  v-if="item.isDetailExpandable"
                  :class="ns.e('expand-toggle')"
                  type="button"
                  :aria-label="expandedRowSet.has(item.key) ? locale.collapse : locale.expand"
                  :aria-expanded="expandedRowSet.has(item.key)"
                  @click.stop="toggleExpandRow(item)"
                >
                  <BiliIcon
                    :class="[ns.e('expand-icon'), ns.is('expanded', expandedRowSet.has(item.key))]"
                    name="chevron-right"
                  />
                </button>
              </td>

              <td
                v-if="selection"
                :class="[
                  ns.e('cell'),
                  ns.e('selection-cell'),
                  ns.is('fixed-left', hasFixedLeft),
                  ns.is('fixed-leading', hasFixedLeft)
                ]"
                :style="leadingStyle('selection')"
              >
                <BiliCheckbox
                  :model-value="selectionState.isSelected(item.row, rowIndexAt(rowIndex))"
                  :disabled="!selectionState.isSelectable(item.row, rowIndexAt(rowIndex))"
                  :aria-label="
                    formatLocale(locale.selectRow, { index: rowIndexAt(rowIndex) + 1 })
                  "
                  @click.stop
                  @change="checked => handleRowToggle(item.row, rowIndexAt(rowIndex), checked)"
                />
              </td>

              <td
                v-for="(column, columnIndex) in orderedColumns"
                :key="columnKeyAt(column, columnIndex)"
                :class="[
                  ns.e('cell'),
                  ...fixedClasses(column, columnIndex),
                  column.className
                ]"
                :style="cellStyle(column, columnIndex, item)"
              >
                <span :class="ns.e('cell-content')">
                  <button
                    v-if="columnIndex === 0 && item.isTreeParent"
                    :class="ns.e('tree-toggle')"
                    type="button"
                    :aria-label="
                      treeExpandedSet.has(item.key) ? locale.collapse : locale.expand
                    "
                    :aria-expanded="treeExpandedSet.has(item.key)"
                    @click.stop="toggleTree(item)"
                  >
                    <BiliIcon
                      :class="[ns.e('tree-icon'), ns.is('expanded', treeExpandedSet.has(item.key))]"
                      name="chevron-right"
                    />
                  </button>

                  <slot
                    :name="getCellSlot(column, columnIndex)"
                    :row="item.row"
                    :column="column"
                    :value="getValue(item.row, column)"
                    :index="rowIndexAt(rowIndex)"
                  >
                    {{ getCellText(item.row, column, rowIndexAt(rowIndex)) }}
                  </slot>
                </span>
              </td>
            </tr>

            <tr
              v-if="expandable && item.isDetailExpandable && expandedRowSet.has(item.key)"
              :class="ns.e('expand-row')"
            >
              <td :colspan="colspan" :class="ns.e('expand-cell')">
                <div :class="ns.e('expand-content')">
                  <slot name="expand" :row="item.row" :index="rowIndexAt(rowIndex)" />
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="!displayRows.length">
            <td :colspan="Math.max(colspan, 1)" :class="ns.e('empty')">
              <slot name="empty">{{ displayEmpty }}</slot>
            </td>
          </tr>

          <tr
            v-if="canVirtual && bottomSpacerHeight > 0"
            :class="ns.e('spacer-row')"
            aria-hidden="true"
          >
            <td :colspan="colspan" :style="{ height: `${bottomSpacerHeight}px` }" />
          </tr>
        </tbody>

        <tfoot v-if="showSummary && summaryValues.length">
          <tr :class="ns.e('summary-row')">
            <td
              v-if="expandable"
              :class="[
                ns.e('cell'),
                ns.e('summary-cell'),
                ns.e('expand-cell'),
                ns.is('fixed-left', hasFixedLeft),
                ns.is('fixed-leading', hasFixedLeft)
              ]"
              :style="leadingStyle('expand')"
            />
            <td
              v-if="selection"
              :class="[
                ns.e('cell'),
                ns.e('summary-cell'),
                ns.e('selection-cell'),
                ns.is('fixed-left', hasFixedLeft),
                ns.is('fixed-leading', hasFixedLeft)
              ]"
              :style="leadingStyle('selection')"
            />
            <td
              v-for="(column, index) in orderedColumns"
              :key="columnKeyAt(column, index)"
              :class="[
                ns.e('cell'),
                ns.e('summary-cell'),
                ...fixedClasses(column, index),
                column.className
              ]"
              :style="{ ...columnStyle(column, index), textAlign: column.align ?? 'left' }"
            >
              {{ summaryValues[index] ?? '' }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
