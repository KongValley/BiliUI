import type { PropType } from 'vue'

export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'

export const qrcodeProps = {
  /** Text or URL encoded into the QR code. */
  value: {
    type: String,
    default: ''
  },
  /** Rendered width and height in pixels. */
  size: {
    type: Number,
    default: 160
  },
  /** Module colour. */
  color: {
    type: String,
    default: '#1f2329'
  },
  /** Background colour. */
  background: {
    type: String,
    default: '#ffffff'
  },
  /** Error-correction level, higher recovers more damage with fewer data modules. */
  errorLevel: {
    type: String as PropType<QRCodeErrorLevel>,
    default: 'M'
  },
  /** Quiet-zone width in modules. */
  margin: {
    type: Number,
    default: 2
  },
  /** Centre icon URL. */
  icon: {
    type: String,
    default: ''
  },
  /** Centre icon size in pixels. */
  iconSize: {
    type: Number,
    default: 40
  },
  /** Accessible label. */
  ariaLabel: {
    type: String,
    default: '二维码'
  }
} as const
