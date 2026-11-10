import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'
import type { TreeFieldNames, TreeKey, TreeOption } from '../../../utils/tree'

export type CascaderValue = TreeKey | null | undefined
export type CascaderOption = TreeOption

export const cascaderProps = {
  modelValue: {
    type: [String, Number] as PropType<CascaderValue>,
    default: undefined
  },
  options: {
    type: Array as PropType<CascaderOption[]>,
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
  /** Commit a value when a parent node is clicked, not only on leaves. */
  changeOnSelect: Boolean,
  separator: {
    type: String,
    default: ' / '
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  }
} as const
