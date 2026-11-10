import type { PropType } from 'vue'

export type TransferKey = string | number

export interface TransferItem {
  key: TransferKey
  label: string
  disabled?: boolean
  [key: string]: any
}

export type TransferDirection = 'left' | 'right'

export const transferProps = {
  data: {
    type: Array as PropType<TransferItem[]>,
    default: () => []
  },
  /** Keys currently in the right panel (pair with `v-model`). */
  modelValue: {
    type: Array as PropType<TransferKey[]>,
    default: () => []
  },
  titles: {
    type: Array as PropType<string[]>,
    default: () => ['列表 1', '列表 2']
  },
  filterable: Boolean,
  filterPlaceholder: {
    type: String,
    default: '请输入关键字'
  },
  disabled: Boolean,
  /** Show a select-all checkbox in each panel header. */
  showSelectAll: {
    type: Boolean,
    default: true
  }
} as const
