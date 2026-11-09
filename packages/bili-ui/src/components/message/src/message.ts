export type MessageType = 'info' | 'success' | 'warning' | 'error'

export interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
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
