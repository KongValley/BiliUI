import type { PropType } from 'vue'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsDirection = 'horizontal' | 'vertical'

export const stepsProps = {
  /** Index of the current step. Earlier steps default to `finish`. */
  active: {
    type: Number,
    default: 0
  },
  direction: {
    type: String as PropType<StepsDirection>,
    default: 'horizontal'
  },
  /** Marks a finished step as errored. */
  processStatus: {
    type: String as PropType<StepStatus>,
    default: 'process'
  },
  /** Compact layout without descriptions. */
  simple: Boolean,
  /** Space between horizontal steps, in px. */
  space: {
    type: [Number, String] as PropType<number | string>,
    default: ''
  },
  /** Let the user jump between steps by clicking. */
  clickable: Boolean
} as const

export const stepProps = {
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  /** Overrides the status derived from the parent `active` index. */
  status: {
    type: String as PropType<StepStatus>,
    default: ''
  }
} as const

export type StepsProps = typeof stepsProps
export type StepProps = typeof stepProps
