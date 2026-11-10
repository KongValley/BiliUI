import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

/** Options that share a heading. Rendered as a non-selectable group. */
export interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

export type SelectOptionItem = SelectOption | SelectOptionGroup

export type SelectSingleValue = string | number | null | undefined
export type SelectModelValue = SelectSingleValue | SelectSingleValue[]

export function isOptionGroup(item: SelectOptionItem): item is SelectOptionGroup {
  return Array.isArray((item as SelectOptionGroup).options)
}

export const selectProps = {
  modelValue: {
    type: [String, Number, Array] as PropType<SelectModelValue>,
    default: undefined
  },
  options: {
    type: Array as PropType<SelectOptionItem[]>,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  disabled: Boolean,
  /** Extra class on the teleported panel, useful for per-instance theming. */
  popperClass: {
    type: String,
    default: ''
  },
  clearable: Boolean,
  filterable: Boolean,
  /** Multi-select. The bound value becomes an array. */
  multiple: Boolean,
  /** Show at most N tags, the rest collapse into a `+N` tag. */
  maxTagCount: {
    type: Number,
    default: undefined
  },
  /** Render a select-all row at the top of the panel (multiple only). */
  selectAll: Boolean,
  /** Custom local filter; defaults to a case-insensitive label match. */
  filterMethod: {
    type: Function as PropType<(query: string, option: SelectOption) => boolean>,
    default: undefined
  },
  /** Skip local filtering and let `remoteMethod` provide the options. */
  remote: Boolean,
  /** Called with the keyword while typing. May return a promise. */
  remoteMethod: {
    type: Function as PropType<(query: string) => void | Promise<void>>,
    default: undefined
  },
  loading: Boolean,
  /** Force virtual scrolling. By default it turns on above `virtualThreshold`. */
  virtual: {
    type: Boolean,
    default: undefined
  },
  virtualThreshold: {
    type: Number,
    default: 200
  },
  /** Row height used by the virtual list. */
  itemHeight: {
    type: Number,
    default: 34
  },
  panelMaxHeight: {
    type: Number,
    default: 264
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  }
} as const
