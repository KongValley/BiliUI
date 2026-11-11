import type { PropType } from 'vue'

export type RibbonPlacement = 'start' | 'end'

export const ribbonProps = {
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  placement: {
    type: String as PropType<RibbonPlacement>,
    default: 'end'
  }
} as const

export type RibbonProps = typeof ribbonProps
