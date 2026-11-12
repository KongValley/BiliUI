import type { Component, PropType } from 'vue'
import type { MessageOptions } from '../../message'
import type { NotificationOptions } from '../../notification'

export const appProps = {
  /** Wrapper element or component rendered around the subtree. */
  component: {
    type: [String, Object, Function] as PropType<string | Component>,
    default: 'div'
  },
  /** Default options merged into every `useApp().message` call. */
  message: {
    type: Object as PropType<Partial<MessageOptions>>,
    default: () => ({})
  },
  /** Default options merged into every `useApp().notification` call. */
  notification: {
    type: Object as PropType<Partial<NotificationOptions>>,
    default: () => ({})
  }
} as const
