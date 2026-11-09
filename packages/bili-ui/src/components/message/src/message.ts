export type MessageType = 'info' | 'success' | 'warning' | 'error'

export type MessagePosition =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'

export interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
  /** Where the message appears. */
  position?: MessagePosition
  /** Show a countdown bar that shrinks as the auto-close timer runs. */
  showProgress?: boolean
  /** Pause the auto-close countdown while the pointer is over the message. */
  pauseOnHover?: boolean
  onClose?: () => void
}

export type MessageParams = string | MessageOptions

export interface MessageInstance {
  close: () => void
}
