import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export type SelectValue = string | number | null | undefined

export const selectProps = {
  modelValue: {
    type: [String, Number] as PropType<SelectValue>,
    default: undefined
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    default: () => []
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
  filterable: Boolean,
  emptyText: {
    type: String,
    default: '暂无数据'
  }
} as const
