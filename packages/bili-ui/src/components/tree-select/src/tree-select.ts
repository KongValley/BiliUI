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
    default: '请选择'
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  disabled: Boolean,
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
    default: '搜索节点'
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  }
} as const
