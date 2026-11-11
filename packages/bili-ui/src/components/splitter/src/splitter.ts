import type { PropType } from 'vue'

export type SplitterDirection = 'horizontal' | 'vertical'

export const splitterProps = {
  /** Size of the start pane, as a percentage. */
  modelValue: {
    type: Number,
    default: 50
  },
  direction: {
    type: String as PropType<SplitterDirection>,
    default: 'horizontal'
  },
  /** Minimum start-pane percentage. */
  min: {
    type: Number,
    default: 10
  },
  /** Maximum start-pane percentage. */
  max: {
    type: Number,
    default: 90
  },
  /** Keyboard resize step, in percentage points. */
  step: {
    type: Number,
    default: 5
  },
  dividerSize: {
    type: Number,
    default: 6
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: 240
  },
  disabled: Boolean
} as const
