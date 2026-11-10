import type { PropType } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'

export interface NotificationOptions {
  title?: string
  message: string
  type?: NotificationType
  duration?: number
  showClose?: boolean
  position?: NotificationPosition
  /** Show a countdown bar that shrinks as the auto-close timer runs. */
  showProgress?: boolean
  onClose?: () => void
}

export const notificationProps = {
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  /** Internal: namespace used by the imperative notification API. */
  namespace: {
    type: String,
    default: undefined
  },
  type: {
    type: String as PropType<NotificationType>,
    default: 'info'
  },
  duration: {
    type: Number,
    default: 4500
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: true
  }
} as const

export type NotificationProps = typeof notificationProps
