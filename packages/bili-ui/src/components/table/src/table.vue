<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { getProp } from '../../../utils/object'
import BiliIcon from '../../icon/src/icon.vue'
import { vLoading } from '../../loading/src/directive'
import {
  tableProps,
  type TableColumn,
  type TableSortOrder
} from './table'

defineOptions({ name: 'BiliTable' })

const props = defineProps(tableProps)

const emit = defineEmits<{
  'sort-change': [payload: { prop: string; order: TableSortOrder }]
}>()

const ns = useNamespace('table')

const sortProp = ref('')
const sortOrder = ref<TableSortOrder>(null)

const sortedData = computed(() => {
  if (!sortProp.value || !sortOrder.value) return props.data

  const data = [...props.data]
  const direction = sortOrder.value === 'asc' ? 1 : -1

  data.sort((left, right) => {
    const leftValue = getProp(left, sortProp.value)
    const rightValue = getProp(right, sortProp.value)

    if (leftValue === rightValue) return 0
    if (leftValue === null || leftValue === undefined) return -1 * direction
    if (rightValue === null || rightValue === undefined) return 1 * direction

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return (leftValue - rightValue) * direction
    }

    return String(leftValue).localeCompare(String(rightValue), 'zh-CN') * direction
  })

  return data
})

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

const columnStyle = (column: TableColumn) => ({
  width: column.width !== undefined ? addUnit(column.width) : undefined,
  minWidth: column.minWidth !== undefined ? addUnit(column.minWidth) : undefined,
  textAlign: column.align ?? 'left'
})

const handleSort = (column: TableColumn) => {
  if (!column.sortable || !column.prop) return

  if (sortProp.value !== column.prop) {
    sortProp.value = column.prop
    sortOrder.value = 'asc'
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
  } else if (sortOrder.value === 'desc') {
    sortProp.value = ''
    sortOrder.value = null
  } else {
    sortOrder.value = 'asc'
  }

  emit('sort-change', { prop: column.prop, order: sortOrder.value })
}
</script>

<template>
  <div
    v-loading="loading"
    :class="[
      ns.b(),
      ns.m(size),
      ns.is('border', border),
      ns.is('stripe', stripe)
    ]"
  >
    <div :class="ns.e('wrapper')">
      <table :class="ns.e('inner')" cellspacing="0" cellpadding="0">
        <colgroup>
          <col
            v-for="(column, index) in columns"
            :key="index"
            :style="{ width: column.width !== undefined ? addUnit(column.width) : undefined }"
          />
        </colgroup>

        <thead :class="ns.e('head')">
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="[
                ns.e('cell'),
                ns.is('sortable', column.sortable),
                ns.is('sorted', sortProp === column.prop && !!sortOrder)
              ]"
              :style="columnStyle(column)"
              :aria-sort="
                sortProp === column.prop && sortOrder
                  ? sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined
              "
              @click="handleSort(column)"
            >
              <span :class="ns.e('cell-label')">
                <slot :name="getHeaderSlot(column, index)" :column="column">
                  {{ column.label ?? '' }}
                </slot>
              </span>
              <span v-if="column.sortable" :class="ns.e('sorter')">
                <BiliIcon
                  :class="[ns.e('sort-icon'), ns.is('asc', sortProp === column.prop && sortOrder === 'asc')]"
                  name="chevron-up"
                />
                <BiliIcon
                  :class="[ns.e('sort-icon'), ns.is('desc', sortProp === column.prop && sortOrder === 'desc')]"
                  name="chevron-down"
                />
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, rowIndex) in sortedData"
            :key="getRowKey(row, rowIndex)"
            :class="ns.e('row')"
          >
            <td
              v-for="(column, columnIndex) in columns"
              :key="columnIndex"
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

          <tr v-if="!sortedData.length">
            <td :colspan="Math.max(columns.length, 1)" :class="ns.e('empty')">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
