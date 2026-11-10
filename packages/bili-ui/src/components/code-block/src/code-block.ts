import type { PropType } from 'vue'

export const codeBlockProps = {
  /** Code source. Rendered as text nodes, never as HTML. */
  code: {
    type: String,
    default: ''
  },
  /** Language hint for highlighting and the header badge. */
  language: {
    type: String,
    default: 'text'
  },
  /** Optional file name shown in the header. */
  title: {
    type: String,
    default: ''
  },
  showLineNumbers: Boolean,
  copyable: {
    type: Boolean,
    default: true
  },
  highlight: {
    type: Boolean,
    default: true
  },
  wrap: Boolean,
  /** Enables vertical scrolling once the content gets taller than this. */
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  }
} as const

export type CodeBlockProps = typeof codeBlockProps
