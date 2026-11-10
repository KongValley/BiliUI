import type { PropType } from 'vue'

export type TourPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export type TourTarget = string | HTMLElement | (() => HTMLElement | null)

export interface TourStep {
  /** Element, selector or resolver pointing at the highlighted target. */
  target?: TourTarget
  title?: string
  description?: string
  placement?: TourPlacement
}

export const tourProps = {
  /** Current step index; a negative value hides the tour. */
  modelValue: {
    type: Number,
    default: 0
  },
  steps: {
    type: Array as PropType<TourStep[]>,
    default: () => []
  },
  /** Show the dark cut-out mask around the target. */
  mask: {
    type: Boolean,
    default: true
  },
  /** Extra space kept between the mask cut-out and the target edges. */
  maskPadding: {
    type: Number,
    default: 4
  },
  /** Extra class on the teleported tour root, useful for per-instance theming. */
  popperClass: {
    type: String,
    default: ''
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  closeOnMaskClick: Boolean,
  /** Scroll the target into view whenever the step changes. */
  scrollIntoView: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: undefined
  }
} as const
