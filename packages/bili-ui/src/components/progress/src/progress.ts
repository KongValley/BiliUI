import type { PropType } from 'vue'

export type ProgressType = 'line' | 'circle' | 'dashboard'
export type ProgressStatus = 'normal' | 'success' | 'warning' | 'error'

export const progressProps = {
  /** Completion percentage, 0–100. */
  percentage: {
    type: Number,
    default: 0
  },
  type: {
    type: String as PropType<ProgressType>,
    default: 'line'
  },
  status: {
    type: String as PropType<ProgressStatus>,
    default: 'normal'
  },
  strokeWidth: {
    type: Number,
    default: undefined
  },
  /** Shows the percentage inside / beside the bar. */
  showText: {
    type: Boolean,
    default: true
  },
  /** Custom text; receives the clamped percentage. */
  format: {
    type: Function as PropType<(percentage: number) => string>,
    default: undefined
  },
  /** Colour of the filled bar; overrides `status`. */
  color: {
    type: String,
    default: ''
  },
  /** Second progress segment, e.g. 60 means 60% success of the 80% progress. */
  successPercentage: {
    type: Number,
    default: 0
  },
  /** Animated stripes for an indeterminate task. */
  striped: Boolean,
  /** Marches the stripes to signal ongoing work. */
  stripedAnimated: Boolean,
  /** Circle / dashboard diameter in px. */
  size: {
    type: Number,
    default: 120
  },
  /** Round caps on line and circle strokes. */
  round: {
    type: Boolean,
    default: true
  }
} as const

export type ProgressProps = typeof progressProps
