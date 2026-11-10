import type { PropType } from 'vue'

export type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

export const imageProps = {
  /** Image URL. */
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  /** How the image fills its box, maps to `object-fit`. */
  fit: {
    type: String as PropType<ImageFit>,
    default: 'fill'
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  /** Images available in the preview dialog. Clicking opens it when non-empty. */
  previewSrcList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  /** Index shown when the preview dialog opens. */
  initialIndex: {
    type: Number,
    default: 0
  },
  /** Mount the dialog under `body`; disable to keep it inside the image. */
  previewTeleported: {
    type: Boolean,
    default: true
  },
  /** Close the dialog when the backdrop is clicked. */
  hideOnClickModal: Boolean,
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  /** Render the native `loading="lazy"` attribute. */
  lazy: Boolean,
  /** Lower zoom limit inside the preview dialog. */
  minScale: {
    type: Number,
    default: 0.25
  },
  /** Upper zoom limit inside the preview dialog. */
  maxScale: {
    type: Number,
    default: 4
  },
  /** Multiplier applied by the zoom buttons, wheel and double click. */
  zoomRate: {
    type: Number,
    default: 1.25
  },
  /** Explicit overlay z-index; auto-incremented when omitted. */
  zIndex: {
    type: Number,
    default: undefined
  },
  /** Extra class on the teleported preview layer. */
  previewClass: {
    type: String,
    default: ''
  }
} as const

export const imageViewerProps = {
  urlList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  visible: Boolean,
  alt: {
    type: String,
    default: ''
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  teleported: {
    type: Boolean,
    default: true
  },
  hideOnClickModal: Boolean,
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: undefined
  },
  /** Extra class on the teleported preview layer. */
  previewClass: {
    type: String,
    default: ''
  },
  minScale: {
    type: Number,
    default: 0.25
  },
  maxScale: {
    type: Number,
    default: 4
  },
  zoomRate: {
    type: Number,
    default: 1.25
  }
} as const
