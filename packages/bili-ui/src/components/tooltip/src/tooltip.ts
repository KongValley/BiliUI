import type { PropType } from 'vue'
import type { Placement } from '@floating-ui/dom'

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual'
export type TooltipEffect = 'dark' | 'light'

export const tooltipProps = {
  content: {
    type: String,
    default: ''
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'top'
  },
  trigger: {
    type: String as PropType<TooltipTrigger>,
    default: 'hover'
  },
  effect: {
    type: String as PropType<TooltipEffect>,
    default: 'dark'
  },
  disabled: Boolean,
  delay: {
    type: Number,
    default: 100
  },
  offset: {
    type: Number,
    default: 8
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  }
} as const
