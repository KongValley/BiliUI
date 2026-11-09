import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export type SwitchValue = boolean | string | number

export const switchProps = {
  modelValue: {
    type: [Boolean, String, Number] as PropType<SwitchValue>,
    default: false
  },
  activeValue: {
    type: [Boolean, String, Number] as PropType<SwitchValue>,
    default: true
  },
  inactiveValue: {
    type: [Boolean, String, Number] as PropType<SwitchValue>,
    default: false
  },
  activeText: {
    type: String,
    default: ''
  },
  inactiveText: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: 'md'
  },
  disabled: Boolean,
  loading: Boolean,
  width: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  }
} as const
