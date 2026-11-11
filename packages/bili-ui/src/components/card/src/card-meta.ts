export const cardMetaProps = {
  /** Avatar image URL rendered on the left. */
  avatar: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
} as const

export type CardMetaProps = typeof cardMetaProps
