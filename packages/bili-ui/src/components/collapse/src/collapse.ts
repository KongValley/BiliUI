import type { PropType } from 'vue'

export const collapseProps = {
  /** Open panel names when the component is uncontrolled. */
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | Array<string | number>>,
    default: undefined
  },
  /** Only one panel may stay open at a time. */
  accordion: Boolean,
  bordered: {
    type: Boolean,
    default: true
  }
} as const

export const collapseItemProps = {
  name: {
    type: [String, Number] as PropType<string | number>,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  /** Icon shown before the title. */
  icon: {
    type: String,
    default: ''
  },
  disabled: Boolean,
  /** Hides the divider under the header. */
  hideBorder: Boolean
} as const

export type CollapseProps = typeof collapseProps
export type CollapseItemProps = typeof collapseItemProps
