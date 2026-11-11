export const cardGridProps = {
  /** Show the hover background and pointer cursor. */
  hoverable: {
    type: Boolean,
    default: true
  }
} as const

export type CardGridProps = typeof cardGridProps
