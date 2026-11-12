import type { Component, PropType } from 'vue'

export type FlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'flex-start'
  | 'flex-end'

export type FlexAlign =
  | 'start'
  | 'end'
  | 'center'
  | 'baseline'
  | 'stretch'
  | 'flex-start'
  | 'flex-end'

export type FlexGap = 'small' | 'middle' | 'large' | number | string

export const flexProps = {
  /** Wrapper element or component. */
  component: {
    type: [String, Object, Function] as PropType<string | Component>,
    default: 'div'
  },
  vertical: Boolean,
  wrap: {
    type: [Boolean, String] as PropType<boolean | 'nowrap' | 'wrap' | 'wrap-reverse'>,
    default: undefined
  },
  justify: {
    type: String as PropType<FlexJustify>,
    default: undefined
  },
  align: {
    type: String as PropType<FlexAlign>,
    default: undefined
  },
  gap: {
    type: [String, Number] as PropType<FlexGap>,
    default: undefined
  },
  /** `flex` shorthand applied to the container itself. */
  flex: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  }
} as const
