import { withInstall } from '../../utils/install'
import NotificationComponent from './src/notification.vue'
import { BiliNotification, createNotificationApi } from './src/method'

export const BiliNotificationComponent = withInstall(NotificationComponent)

export { BiliNotification, createNotificationApi }
export default BiliNotification
export type {
  CreateNotificationApiOptions,
  NotificationApi,
  NotificationInstance
} from './src/method'
export type {
  NotificationOptions,
  NotificationPosition,
  NotificationProps,
  NotificationType
} from './src/notification'
