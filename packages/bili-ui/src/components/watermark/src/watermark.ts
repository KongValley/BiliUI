import type { PropType } from 'vue'

export interface WatermarkFont {
  color?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string | number
  fontStyle?: string
}

export const watermarkProps = {
  /** One line or multiple lines of text. */
  content: {
    type: [String, Array] as PropType<string | string[]>,
    default: ''
  },
  /** Image URL drawn instead of text. Takes precedence over `content`. */
  image: {
    type: String,
    default: ''
  },
  /** Opacity applied to the image watermark. */
  imageOpacity: {
    type: Number,
    default: 0.3
  },
  font: {
    type: Object as PropType<WatermarkFont>,
    default: () => ({})
  },
  /** Width of one watermark cell. */
  width: {
    type: Number,
    default: 120
  },
  /** Height of one watermark cell. */
  height: {
    type: Number,
    default: 64
  },
  /** Rotation in degrees. */
  rotate: {
    type: Number,
    default: -22
  },
  /** Horizontal/vertical gap between cells. */
  gap: {
    type: [Number, Array] as PropType<number | [number, number]>,
    default: () => [100, 100]
  },
  /** Background offset. */
  offset: {
    type: [Number, Array] as PropType<number | [number, number]>,
    default: () => [0, 0]
  },
  zIndex: {
    type: Number,
    default: 9
  }
} as const
