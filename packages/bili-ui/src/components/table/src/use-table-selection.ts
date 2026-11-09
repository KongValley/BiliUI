import { computed, ref } from 'vue'
import { getProp } from '../../../utils/object'
import { debugWarn } from '../../../utils/error'
import type { TableRowKey, TableRowKeyResolver } from './table'

export interface SelectionPayload {
  keys: TableRowKey[]
  rows: any[]
  /** The row that triggered this change; undefined for select-all actions. */
  row?: any
}

export interface SelectionOptions {
  data: () => any[]
  rowKey: () => TableRowKeyResolver | undefined
  selectedKeys: () => TableRowKey[] | undefined
  selectable: () => ((row: any, index: number) => boolean) | undefined
  onChange: (payload: SelectionPayload) => void
  onUpdateKeys: (keys: TableRowKey[]) => void
}

export function useTableSelection(options: SelectionOptions) {
  const innerKeys = ref<TableRowKey[]>([])
  const isControlled = computed(() => options.selectedKeys() !== undefined)
  const keys = computed<TableRowKey[]>(() => options.selectedKeys() ?? innerKeys.value)

  const warnMissingKey = (rowKey: TableRowKeyResolver | undefined) => {
    debugWarn(
      'BiliTable',
      rowKey
        ? `rowKey "${String(rowKey)}" is missing on a row, falling back to index`
        : 'selection without rowKey falls back to row index; pass rowKey for stable selection'
    )
  }

  /**
   * Identity map built from `data`, so a row keeps its key when sorting changes
   * its rendered position. Only object rows can be tracked this way; primitive
   * rows fall back to their index in the source data.
   */
  const identity = computed(() => {
    const objectKeys = new WeakMap<object, TableRowKey>()
    const listKeys: TableRowKey[] = []
    let warned = false

    options.data().forEach((row, index) => {
      const rowKey = options.rowKey()
      let key: TableRowKey
      if (typeof rowKey === 'function') {
        key = rowKey(row, index)
      } else if (typeof rowKey === 'string') {
        const value = getProp(row, rowKey)
        if (value === undefined || value === null) {
          key = index
          if (!warned) {
            warnMissingKey(rowKey)
            warned = true
          }
        } else {
          key = value as TableRowKey
        }
      } else {
        key = index
        if (!warned) {
          warnMissingKey(undefined)
          warned = true
        }
      }

      listKeys.push(key)
      if (row !== null && typeof row === 'object') objectKeys.set(row, key)
    })

    return { objectKeys, listKeys }
  })

  const getKey = (row: any, index: number): TableRowKey => {
    if (row !== null && typeof row === 'object') {
      const key = identity.value.objectKeys.get(row)
      if (key !== undefined) return key
    }
    return identity.value.listKeys[index] ?? index
  }

  const isSelectable = (row: any, index: number): boolean => {
    const predicate = options.selectable()
    return predicate ? predicate(row, index) : true
  }

  const isSelected = (row: any, index: number): boolean => {
    if (!isSelectable(row, index)) return false
    return keys.value.includes(getKey(row, index))
  }

  const keySet = computed(() => new Set(keys.value))

  const selectableEntries = computed(() =>
    options.data()
      .map((row, index) => ({ row, index, key: getKey(row, index) }))
      .filter(entry => isSelectable(entry.row, entry.index))
  )

  const selectableKeys = computed(() => selectableEntries.value.map(entry => entry.key))

  const selectedRows = computed(() =>
    options.data().filter((row, index) => keySet.value.has(getKey(row, index)))
  )

  const allSelected = computed(
    () =>
      selectableKeys.value.length > 0 &&
      selectableKeys.value.every(key => keySet.value.has(key))
  )

  const partiallySelected = computed(
    () =>
      !allSelected.value &&
      selectableKeys.value.some(key => keySet.value.has(key))
  )

  /**
   * Applies a new key set and returns the resulting payload. Returning it keeps
   * callers from re-reading `keys` — under `v-model` the prop has not been
   * updated yet at this point, so a re-read would still show the old selection.
   */
  const applyKeys = (next: TableRowKey[], changedRow?: any): SelectionPayload => {
    if (!isControlled.value) innerKeys.value = next
    const payload: SelectionPayload = {
      keys: next,
      rows: options.data().filter((row, index) => next.includes(getKey(row, index))),
      ...(changedRow !== undefined ? { row: changedRow } : {})
    }
    options.onUpdateKeys(next)
    options.onChange(payload)
    return payload
  }

  const toggleRow = (
    row: any,
    index: number,
    checked?: boolean
  ): SelectionPayload | undefined => {
    if (!isSelectable(row, index)) return undefined
    const key = getKey(row, index)
    const nextChecked = checked ?? !keys.value.includes(key)

    const next = nextChecked
      ? [...keys.value.filter(item => item !== key), key]
      : keys.value.filter(item => item !== key)

    return applyKeys(next, row)
  }

  const toggleAll = (checked?: boolean): SelectionPayload => {
    const shouldSelect = checked ?? !allSelected.value
    if (shouldSelect) {
      // Preserve keys outside the current data set (e.g. from another page).
      const preserved = keys.value.filter(key => !selectableKeys.value.includes(key))
      return applyKeys([...preserved, ...selectableKeys.value])
    }
    return applyKeys(keys.value.filter(key => !selectableKeys.value.includes(key)))
  }

  const clearSelection = (): SelectionPayload => applyKeys([])

  return {
    keys,
    selectedRows,
    selectableRows: computed(() => selectableEntries.value.map(entry => entry.row)),
    allSelected,
    partiallySelected,
    getKey,
    isSelectable,
    isSelected,
    toggleRow,
    toggleAll,
    clearSelection
  }
}
