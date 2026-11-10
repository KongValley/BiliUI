import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'
import type { TreeFieldNames, TreeKey, TreeOption } from '../../../utils/tree'

export type TreeSelectValue = TreeKey | TreeKey[] | null | undefined

export const treeSelectProps = {
  modelValue: {
    type: [String, Number, Array] as PropType<TreeSelectValue>,
    default: undefined
  },
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  /** Custom field names for label / value / children / disabled. */
  fieldNames: {
    type: Object as PropType<TreeFieldNames>,
    default: undefined
  },
  placeholder: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  disabled: Boolean,
  /** Extra class on the teleported panel, useful for per-instance theming. */
  popperClass: {
    type: String,
    default: ''
  },
  clearable: Boolean,
  /** Checkbox mode; the bound value becomes an array. */
  multiple: Boolean,
  /** Collapse tags beyond this count in multiple mode. */
  maxTagCount: {
    type: Number,
    default: undefined
  },
  /** Parent and child check independently in multiple mode. */
  checkStrictly: Boolean,
  defaultExpandAll: Boolean,
  filterable: {
    type: Boolean,
    default: true
  },
  filterPlaceholder: {
    type: String,
    default: ''
  },
  emptyText: {
    type: String,
    default: ''
  }
} as const
