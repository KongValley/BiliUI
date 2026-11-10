import { withInstall } from '../../utils/install'
import NotificationComponent from './src/notification.vue'
import { BiliNotification } from './src/method'

export const BiliNotificationComponent = withInstall(NotificationComponent)

export { BiliNotification }
export default BiliNotification
export type { NotificationApi, NotificationInstance } from './src/method'
export type {
  NotificationOptions,
  NotificationPosition,
  NotificationProps,
  NotificationType
} from './src/notification'
