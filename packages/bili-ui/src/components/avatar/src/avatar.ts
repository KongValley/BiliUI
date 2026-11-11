import type { PropType } from 'vue'

export type AvatarShape = 'circle' | 'square'
export type AvatarFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

export const avatarProps = {
  /** Image source. Falls back to icon, initials or the default slot. */
  src: {
    type: String,
    default: ''
  },
  /** Accessible label, also used when the image fails. */
  alt: {
    type: String,
    default: ''
  },
  /** Name used to derive the initials and the deterministic background hue. */
  name: {
    type: String,
    default: ''
  },
  /** Icon name shown when there is no image. */
  icon: {
    type: String,
    default: ''
  },
  /** `sm` / `md` / `lg` or any CSS length / pixel number. */
  size: {
    type: [String, Number] as PropType<string | number>,
    default: undefined
  },
  shape: {
    type: String as PropType<AvatarShape>,
    default: undefined
  },
  fit: {
    type: String as PropType<AvatarFit>,
    default: 'cover'
  },
  /** Adds a ring so the avatar stands out on tinted surfaces. */
  bordered: Boolean
} as const

export type AvatarProps = typeof avatarProps
