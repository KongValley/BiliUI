import type { PropType } from 'vue'

export type TypographyType =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'disabled'

export interface TypographyCopyable {
  /** Text copied to the clipboard; defaults to the rendered content. */
  text?: string
}

const copyableProp = {
  type: [Boolean, Object] as PropType<boolean | TypographyCopyable>,
  default: false
}

const editableProp = {
  type: Boolean,
  default: false
}

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
  ellipsis: ellipsisProp,
  copyable: copyableProp,
  editable: editableProp
} as const

export const titleProps = {
  level: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5>,
    default: 1
  },
  type: typeProp,
  ellipsis: ellipsisProp,
  copyable: copyableProp,
  editable: editableProp
} as const

export const paragraphProps = {
  type: typeProp,
  strong: Boolean,
  italic: Boolean,
  underline: Boolean,
  delete: Boolean,
  ellipsis: ellipsisProp,
  copyable: copyableProp,
  editable: editableProp,
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
  ellipsis: ellipsisProp,
  copyable: copyableProp,
  editable: editableProp
} as const
