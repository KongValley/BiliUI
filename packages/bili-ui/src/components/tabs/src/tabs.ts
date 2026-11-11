import type { PropType } from 'vue'

export type TabsType = 'line' | 'card' | 'segment'
export type TabsDirection = 'horizontal' | 'vertical'

export const tabsProps = {
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  /** `line` underline, `card` bordered tabs, `segment` segmented control. */
  type: {
    type: String as PropType<TabsType>,
    default: 'line'
  },
  direction: {
    type: String as PropType<TabsDirection>,
    default: 'horizontal'
  },
  /** Mount panels only after their tab has been visited. */
  lazy: Boolean,
  /** Allow closing tabs that declare `closable`. */
  closable: Boolean,
  /** Render an add button after the last tab. */
  addable: Boolean,
  /** Stretch every tab to an equal share of the width. */
  stretch: Boolean,
  /** Animate the underline; disabled automatically with reduced motion. */
  animated: {
    type: Boolean,
    default: true
  }
} as const

export const tabPaneProps = {
  /** Key used by the parent Tabs. */
  name: {
    type: [String, Number] as PropType<string | number>,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  /** Icon name shown before the label. */
  icon: {
    type: String,
    default: ''
  },
  disabled: Boolean,
  /** Shows a close icon when the parent Tabs has `closable`. */
  closable: Boolean
} as const

export type TabsProps = typeof tabsProps
export type TabPaneProps = typeof tabPaneProps
