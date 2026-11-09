import type { PropType } from 'vue'

export type LayoutMode = 'vertical' | 'horizontal'

export const layoutProps = {
  /** `vertical` stacks header/content/footer; `horizontal` puts the aside beside them. */
  direction: {
    type: String as PropType<LayoutMode>,
    default: 'vertical'
  },
  /** Full viewport height layout — the common admin shell. */
  fullHeight: {
    type: Boolean,
    default: false
  }
} as const

export const layoutHeaderProps = {
  height: {
    type: [String, Number] as PropType<string | number>,
    default: 56
  },
  sticky: Boolean
} as const

export const layoutAsideProps = {
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 220
  },
  collapsed: Boolean,
  collapsedWidth: {
    type: [String, Number] as PropType<string | number>,
    default: 64
  },
  sticky: Boolean
} as const

export const layoutFooterProps = {
  height: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  }
} as const

export const layoutContentProps = {
  /** Inner padding in px, or nothing for an edge-to-edge content area. */
  padding: {
    type: [String, Number] as PropType<string | number>,
    default: 16
  }
} as const
