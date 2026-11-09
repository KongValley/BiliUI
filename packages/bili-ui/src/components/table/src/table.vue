<script setup lang="ts">
import { ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { getProp } from '../../../utils/object'
import BiliIcon from '../../icon/src/icon.vue'
import { vLoading } from '../../loading/src/directive'
import { tableProps, type TableColumn } from './table'
import { useTableSort, type SortPayload } from './use-table-sort'
import { getColumnKey, useTableDrag } from './use-table-drag'

defineOptions({ name: 'BiliTable' })

const props = defineProps(tableProps)

const emit = defineEmits<{
  'sort-change': [payload: SortPayload]
  'column-order-change': [order: string[]]
  'column-resize': [key: string, width: number]
}>()

const ns = useNamespace('table')

const headerRef = ref<HTMLElement | null>(null)

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
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  if (typeof props.rowKey === 'string') return getProp(row, props.rowKey) ?? index
  return index
}

// Width lives on <col> so header and body stay in sync; the header only needs
// alignment and a min-width guard.
const columnStyle = (column: TableColumn, index: number) => ({
  minWidth: column.minWidth !== undefined ? addUnit(column.minWidth) : undefined,
  textAlign: column.align ?? 'left',
  width: (() => {
    const width = getColumnWidth(column, index)
    return width !== undefined ? addUnit(width) : undefined
  })()
})

const handleSort = (column: TableColumn, event: MouseEvent) => {
  // A header drag should never trigger a sort.
  if (dragging.value) return
  toggleSort(column, event.shiftKey)
}

const canResize = (column: TableColumn) =>
  props.resizableColumns && column.resizable !== false

const columnKeyAt = (column: TableColumn, index: number) => getColumnKey(column, index)
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
      ns.is('resizing', resizing)
    ]"
  >
    <div :class="ns.e('wrapper')">
      <table :class="ns.e('inner')" cellspacing="0" cellpadding="0">
        <colgroup>
          <col
            v-for="(column, index) in orderedColumns"
            :key="columnKeyAt(column, index)"
            :style="{
              width: getColumnWidth(column, index) !== undefined
                ? addUnit(getColumnWidth(column, index))
                : column.width !== undefined
                  ? addUnit(column.width)
                  : undefined
            }"
          />
        </colgroup>

        <thead ref="headerRef" :class="ns.e('head')">
          <tr>
            <th
              v-for="(column, index) in orderedColumns"
              :key="columnKeyAt(column, index)"
              :class="[
                ns.e('cell'),
                ns.is('sortable', column.sortable),
                ns.is('sorted', !!getSortOrder(column.prop)),
                ns.is('dragging', dragKey === columnKeyAt(column, index)),
                ns.is('drag-over', overKey === columnKeyAt(column, index)),
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
                  :aria-label="`排序优先级 ${getSortPriority(column.prop)}`"
                >
                  {{ getSortPriority(column.prop) }}
                </span>
              </span>

              <span
                v-if="canResize(column)"
                :class="[ns.e('resize-handle'), ns.is('active', resizing)]"
                role="separator"
                aria-orientation="vertical"
                :aria-label="`调整${column.label ?? ''}列宽`"
                @pointerdown="startResize($event, columnKeyAt(column, index))"
                @click.stop
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, rowIndex) in sortedData(props.data)"
            :key="getRowKey(row, rowIndex)"
            :class="ns.e('row')"
          >
            <td
              v-for="(column, columnIndex) in orderedColumns"
              :key="columnKeyAt(column, columnIndex)"
              :class="[ns.e('cell'), column.className]"
              :style="{ textAlign: column.align ?? 'left' }"
            >
              <slot
                :name="getCellSlot(column, columnIndex)"
                :row="row"
                :column="column"
                :value="getValue(row, column)"
                :index="rowIndex"
              >
                {{ getCellText(row, column, rowIndex) }}
              </slot>
            </td>
          </tr>

          <tr v-if="!sortedData(props.data).length">
            <td :colspan="Math.max(orderedColumns.length, 1)" :class="ns.e('empty')">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
