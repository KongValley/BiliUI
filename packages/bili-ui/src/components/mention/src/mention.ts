import type { PropType } from 'vue'

export type MentionValue = string | number

export interface MentionOption {
  label: string
  value: MentionValue
  disabled?: boolean
}

export interface NormalizedMentionOption {
  label: string
  value: MentionValue
  disabled: boolean
}

export const mentionProps = {
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array as PropType<MentionOption[]>,
    default: () => []
  },
  /** Character that starts a mention query. */
  prefix: {
    type: String,
    default: '@'
  },
  /** Appended after a selected mention. */
  split: {
    type: String,
    default: ' '
  },
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 3
  },
  disabled: Boolean,
  /** Width of the suggestion panel in px. */
  width: {
    type: Number,
    default: 220
  },
  emptyText: {
    type: String,
    default: ''
  },
  popperClass: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: undefined
  }
} as const
