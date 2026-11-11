import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'

export type SegmentedValue = string | number

export interface SegmentedOption {
  label: string
  value: SegmentedValue
  icon?: string
  disabled?: boolean
}

export const segmentedProps = {
  modelValue: {
    type: [String, Number] as PropType<SegmentedValue | undefined>,
    default: undefined
  },
  options: {
    type: Array as PropType<SegmentedOption[]>,
    default: () => []
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  /** Stretch every item to fill the container. */
  block: Boolean,
  disabled: Boolean,
  name: {
    type: String,
    default: ''
  }
} as const
