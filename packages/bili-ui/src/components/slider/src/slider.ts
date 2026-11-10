import type { PropType } from 'vue'

export const sliderProps = {
  /** A single number, or `[start, end]` for a range. */
  modelValue: {
    type: [Number, Array] as PropType<number | [number, number]>,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: Boolean,
  /** Show a value tooltip while dragging or hovering. */
  showTooltip: {
    type: Boolean,
    default: true
  },
  /** Custom tooltip text, receives the value. */
  formatTooltip: {
    type: Function as PropType<(value: number) => string>,
    default: undefined
  },
  /** Tick labels; numbers are drawn at those values, `true` splits evenly. */
  marks: {
    type: [Boolean, Object] as PropType<boolean | Record<string, string>>,
    default: false
  },
  vertical: Boolean
} as const

export type SliderProps = typeof sliderProps
