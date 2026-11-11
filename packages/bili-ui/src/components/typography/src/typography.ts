import type { PropType } from 'vue'

export type TypographyType =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'disabled'

const typeProp = {
  type: String as PropType<TypographyType>,
  default: 'default'
}

const ellipsisProp = {
  type: [Boolean, Number] as PropType<boolean | number>,
  default: false
}

export const textProps = {
  type: typeProp,
  /** Rendered element, e.g. `span`, `div`, `strong`. */
  tag: {
    type: String,
    default: 'span'
  },
  strong: Boolean,
  italic: Boolean,
  underline: Boolean,
  delete: Boolean,
  mark: Boolean,
  code: Boolean,
  ellipsis: ellipsisProp
} as const

export const titleProps = {
  level: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5>,
    default: 1
  },
  type: typeProp,
  ellipsis: ellipsisProp
} as const

export const paragraphProps = {
  type: typeProp,
  strong: Boolean,
  italic: Boolean,
  underline: Boolean,
  delete: Boolean,
  ellipsis: ellipsisProp,
  /** Adds the default paragraph bottom spacing. */
  spacing: {
    type: Boolean,
    default: true
  }
} as const

export const linkProps = {
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String,
    default: ''
  },
  type: typeProp,
  underline: {
    type: Boolean,
    default: true
  },
  disabled: Boolean,
  ellipsis: ellipsisProp
} as const
