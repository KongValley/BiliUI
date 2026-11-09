import type { PropType } from 'vue'
import type { FormItemRule } from './types'

export const formItemProps = {
  prop: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  rules: {
    type: [Array, Object] as PropType<FormItemRule | FormItemRule[]>,
    default: undefined
  },
  required: {
    type: Boolean,
    default: undefined
  },
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  showMessage: {
    type: Boolean,
    default: undefined
  },
  error: {
    type: String,
    default: ''
  }
} as const
