import type { PropType } from 'vue'
import type { FormRules } from './types'

export const formProps = {
  model: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  rules: {
    type: Object as PropType<FormRules>,
    default: undefined
  },
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: '96px'
  },
  labelPosition: {
    type: String as PropType<'left' | 'right' | 'top'>,
    default: 'right'
  },
  showMessage: {
    type: Boolean,
    default: true
  }
} as const
