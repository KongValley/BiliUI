import type { App } from 'vue'
import { components } from './components'
import { BiliMessage } from './components/message'
import { BiliNotification } from './components/notification'
import { vLoading } from './components/loading'

export * from './components'
export { BiliMessage, BiliNotification, vLoading }
export {
  useConfig,
  useLocale,
  formatLocale,
  defaultConfig,
  zhCNLocale,
  enUSLocale
} from './hooks/use-config'
export type { BiliConfig, BiliLocale } from './hooks/use-config'

export const version = '0.1.0'

const BiliUI = {
  version,
  install(app: App) {
    components.forEach(component => app.use(component))
    app.directive('loading', vLoading)
    app.config.globalProperties.$message = BiliMessage
    app.config.globalProperties.$notification = BiliNotification
  }
}

export default BiliUI
