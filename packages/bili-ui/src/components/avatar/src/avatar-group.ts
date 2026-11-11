import type { InjectionKey, PropType, Ref } from 'vue'
import type { AvatarShape } from './avatar'

export interface AvatarGroupContext {
  size: Ref<string | number | undefined>
  shape: Ref<AvatarShape | undefined>
  max: Ref<number>
  order: Ref<symbol[]>
  register: (id: symbol) => void
  unregister: (id: symbol) => void
}

export const avatarGroupKey: InjectionKey<AvatarGroupContext> = Symbol('bili-avatar-group')

export const avatarGroupProps = {
  /** Show at most this many avatars, collapsing the rest into `+N`. */
  max: {
    type: Number,
    default: 0
  },
  size: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  shape: {
    type: String as PropType<AvatarShape>,
    default: undefined
  },
  /** Overlap between avatars, negative values stack them. */
  spacing: {
    type: [String, Number] as PropType<string | number>,
    default: -8
  }
} as const
