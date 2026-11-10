import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export const inputProps = {
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  type: {
    type: String as PropType<'text' | 'password' | 'textarea'>,
    default: 'text'
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: Boolean,
  readonly: Boolean,
  clearable: Boolean,
  showPassword: Boolean,
  showCount: Boolean,
  maxlength: {
    type: Number,
    default: undefined
  },
  rows: {
    type: Number,
    default: 2
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
} as const
