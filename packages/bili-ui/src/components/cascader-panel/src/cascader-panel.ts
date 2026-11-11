import type { PropType } from 'vue'
import type { TreeFieldNames, TreeKey, TreeOption } from '../../../utils/tree'

export type CascaderPanelValue = TreeKey | null | undefined

export const cascaderPanelProps = {
  modelValue: {
    type: [String, Number] as PropType<CascaderPanelValue>,
    default: undefined
  },
  options: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  fieldNames: {
    type: Object as PropType<TreeFieldNames>,
    default: undefined
  },
  /** Commit a value when a parent node is clicked, not only on leaves. */
  changeOnSelect: Boolean,
  emptyText: {
    type: String,
    default: ''
  }
} as const

export type CascaderPanelProps = typeof cascaderPanelProps
