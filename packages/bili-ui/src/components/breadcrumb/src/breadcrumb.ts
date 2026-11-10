import type { PropType } from 'vue'

export const breadcrumbProps = {
  /** Separator between items; ignored when the `separator` slot is used. */
  separator: {
    type: String,
    default: '/'
  },
  /** Collapse the middle items into an ellipsis once exceeded. */
  maxItems: {
    type: Number,
    default: 0
  }
} as const

export const breadcrumbItemProps = {
  /** Router link target. Omit on the final item to render plain text. */
  to: {
    type: [String, Object] as PropType<string | Record<string, unknown>>,
    default: undefined
  },
  href: {
    type: String,
    default: ''
  },
  replace: Boolean
} as const

export type BreadcrumbProps = typeof breadcrumbProps
export type BreadcrumbItemProps = typeof breadcrumbItemProps
