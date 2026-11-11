import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export type AutoCompleteOption = string | {
  label: string
  value: string
  disabled?: boolean
}

export interface NormalizedAutoCompleteOption {
  label: string
  value: string
  disabled: boolean
}

export const autoCompleteProps = {
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array as PropType<AutoCompleteOption[]>,
    default: () => []
  },
  /** Async suggestions; when omitted, `options` are filtered locally. */
  fetchSuggestions: {
    type: Function as PropType<
      (query: string) => AutoCompleteOption[] | Promise<AutoCompleteOption[]>
    >,
    default: undefined
  },
  placeholder: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  disabled: Boolean,
  clearable: Boolean,
  /** Fetch suggestions when the input receives focus. */
  triggerOnFocus: {
    type: Boolean,
    default: true
  },
  /** Delay before fetching after typing, in ms. */
  debounce: {
    type: Number,
    default: 200
  },
  emptyText: {
    type: String,
    default: ''
  },
  popperClass: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: undefined
  }
} as const
