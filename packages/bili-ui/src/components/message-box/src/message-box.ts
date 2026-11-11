import type { PropType } from 'vue'

export type MessageBoxType = 'info' | 'success' | 'warning' | 'error'
export type MessageBoxAction = 'confirm' | 'cancel' | 'close'

export interface MessageBoxResult {
  action: MessageBoxAction
  value: string
}

export interface MessageBoxController {
  /** Confirm the dialog programmatically. */
  confirm: () => void
  /** Cancel the dialog programmatically. */
  cancel: () => void
  /** Close the dialog without an operator action. */
  close: () => void
  /** Toggle the loading state of the confirm button. */
  setLoading: (loading: boolean) => void
}

export type MessageBoxBeforeClose = (
  action: MessageBoxAction,
  instance: MessageBoxController,
  done: () => void
) => void | Promise<unknown>

export interface MessageBoxOptions {
  title?: string
  message?: string
  type?: MessageBoxType
  confirmButtonText?: string
  cancelButtonText?: string
  showCancelButton?: boolean
  showClose?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  input?: boolean
  inputValue?: string
  inputPlaceholder?: string
  inputPattern?: RegExp
  inputValidator?: (value: string) => boolean | string
  beforeClose?: MessageBoxBeforeClose
  distinguishCancelAndClose?: boolean
  overlayClass?: string
  panelClass?: string
  zIndex?: number
}

export const messageBoxProps = {
  modelValue: Boolean,
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<MessageBoxType>,
    default: 'info'
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  showCancelButton: Boolean,
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  input: Boolean,
  inputValue: {
    type: String,
    default: ''
  },
  inputPlaceholder: {
    type: String,
    default: ''
  },
  inputPattern: {
    type: RegExp as PropType<RegExp>,
    default: undefined
  },
  inputValidator: {
    type: Function as PropType<(value: string) => boolean | string>,
    default: undefined
  },
  beforeClose: {
    type: Function as PropType<MessageBoxBeforeClose>,
    default: undefined
  },
  distinguishCancelAndClose: Boolean,
  overlayClass: {
    type: String,
    default: ''
  },
  panelClass: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: undefined
  }
} as const

export type MessageBoxProps = typeof messageBoxProps
