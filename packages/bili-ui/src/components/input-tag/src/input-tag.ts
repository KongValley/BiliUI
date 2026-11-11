import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export type InputTagTrigger = 'Enter' | 'Space'

export const inputTagProps = {
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => []
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
  readonly: Boolean,
  clearable: Boolean,
  /** Maximum number of tags; 0 means unlimited. */
  max: {
    type: Number,
    default: 0
  },
  /** Maximum characters per tag. */
  maxlength: {
    type: Number,
    default: undefined
  },
  /** Allow the same tag more than once. */
  allowDuplicate: Boolean,
  /** Characters that commit the current draft. */
  delimiter: {
    type: [String, Array] as PropType<string | string[]>,
    default: ',，'
  },
  /** Key used to commit a tag; commas always commit. */
  trigger: {
    type: String as PropType<InputTagTrigger>,
    default: 'Enter'
  },
  /** Commit the pending draft when the input loses focus. */
  addOnBlur: {
    type: Boolean,
    default: true
  }
} as const

export type InputTagProps = typeof inputTagProps
