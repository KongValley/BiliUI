import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export const inputSearchProps = {
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: ''
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
  loading: Boolean,
  clearable: Boolean,
  /** `true` renders the default search label, a string renders that label. */
  enterButton: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false
  }
} as const

export type InputSearchProps = typeof inputSearchProps
