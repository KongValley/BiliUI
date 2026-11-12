import { inject, type ComputedRef, type InjectionKey } from 'vue'
import { useConfig, type BiliConfig } from '../../../hooks/use-config'
import { BiliMessage, type MessageApi } from '../../message'
import { BiliNotification, type NotificationApi } from '../../notification'
import { BiliMessageBox, type MessageBoxApi } from '../../message-box'

export interface AppContext {
  /** ConfigProvider settings read by the scoped services. */
  config: ComputedRef<BiliConfig>
  message: MessageApi
  notification: NotificationApi
  messageBox: MessageBoxApi
}

export const appContextKey: InjectionKey<AppContext> = Symbol('bili-app-context')

/**
 * Read the services bound to the nearest `<BiliApp>`. Outside an App the global
 * imperative APIs are returned, so the composable is safe to call anywhere.
 */
export function useApp(): AppContext {
  const context = inject(appContextKey, null)
  if (context) return context

  return {
    config: useConfig(),
    message: BiliMessage,
    notification: BiliNotification,
    messageBox: BiliMessageBox
  }
}
