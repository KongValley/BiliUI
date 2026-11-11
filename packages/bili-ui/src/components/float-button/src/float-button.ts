import type { PropType } from 'vue'
import type { ComponentSize } from '../../../utils/types'
import type { InjectionKey, Ref } from 'vue'

export type FloatButtonType = 'default' | 'primary'
export type FloatButtonShape = 'circle' | 'square'

export interface FloatButtonGroupContext {
  inGroup: Ref<boolean>
}

export const floatButtonGroupKey: InjectionKey<FloatButtonGroupContext> = Symbol(
  'bili-float-button-group'
)

export const floatButtonProps = {
  type: {
    type: String as PropType<FloatButtonType>,
    default: 'default'
  },
  shape: {
    type: String as PropType<FloatButtonShape>,
    default: 'circle'
  },
  size: {
    type: [String, Number] as PropType<ComponentSize | number>,
    default: 'md'
  },
  /** Built-in icon name. The default slot overrides it. */
  icon: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String,
    default: ''
  },
  /** Render an anchor instead of a button. */
  disabled: Boolean,
  /** Scroll the page to the top when clicked. */
  backTop: Boolean,
  right: {
    type: [String, Number] as PropType<string | number>,
    default: 24
  },
  bottom: {
    type: [String, Number] as PropType<string | number>,
    default: 24
  },
  zIndex: {
    type: Number,
    default: 100
  }
} as const

export const floatButtonGroupProps = {
  shape: {
    type: String as PropType<FloatButtonShape>,
    default: 'circle'
  },
  direction: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical'
  },
  gap: {
    type: [String, Number] as PropType<string | number>,
    default: 12
  },
  right: {
    type: [String, Number] as PropType<string | number>,
    default: 24
  },
  bottom: {
    type: [String, Number] as PropType<string | number>,
    default: 24
  },
  zIndex: {
    type: Number,
    default: 100
  }
} as const
