import type { InjectionKey, PropType, Ref } from 'vue'

export type AnchorDirection = 'vertical' | 'horizontal'

export interface AnchorLinkState {
  href: string
  /** Href of the closest parent link, used to keep ancestors highlighted. */
  parent: string
  getEl: () => HTMLElement | null
}

export interface AnchorContext {
  direction: Ref<AnchorDirection>
  marker: Ref<boolean>
  activeHref: Ref<string>
  isActive: (href: string) => boolean
  isExactActive: (href: string) => boolean
  registerLink: (link: AnchorLinkState) => void
  unregisterLink: (href: string) => void
  handleClick: (event: MouseEvent, href: string) => void
}

export const anchorContextKey: InjectionKey<AnchorContext> = Symbol('bili-anchor')
export const anchorLinkKey: InjectionKey<{ href: string }> = Symbol('bili-anchor-link')

export const anchorProps = {
  /** Scroll container element or selector. Defaults to the window. */
  container: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: undefined
  },
  /** Distance between the viewport/container top and the target section. */
  offset: {
    type: Number,
    default: 0
  },
  /** Extra tolerance used when deciding which link is active. */
  bound: {
    type: Number,
    default: 15
  },
  /** Smooth-scroll duration in milliseconds; `0` jumps instantly. */
  duration: {
    type: Number,
    default: 300
  },
  /** Show the active marker bar next to the exact active link. */
  marker: {
    type: Boolean,
    default: true
  },
  direction: {
    type: String as PropType<AnchorDirection>,
    default: 'vertical'
  }
} as const

export const anchorLinkProps = {
  /** Target section, e.g. `#usage`. */
  href: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
} as const
