import type { App } from 'vue'
import { components } from './components'
import { BiliMessage } from './components/message'
import { BiliMessageBox } from './components/message-box'
import { BiliNotification } from './components/notification'
import { vLoading } from './components/loading'

export * from './components'
export { BiliMessage, BiliMessageBox, BiliNotification, vLoading }
export type {
  MessageBoxAction,
  MessageBoxApi,
  MessageBoxBeforeClose,
  MessageBoxController,
  MessageBoxOptions,
  MessageBoxPromise,
  MessageBoxResult,
  MessageBoxType
} from './components/message-box'
export {
  useConfig,
  useLocale,
  formatLocale,
  defaultConfig,
  zhCNLocale,
  enUSLocale
} from './hooks/use-config'
export type { BiliConfig, BiliLocale } from './hooks/use-config'
export {
  setThemeColor,
  resetThemeColor,
  getThemeColor,
  themeColorPresets,
  defaultThemeColor
} from './hooks/use-theme'
export type { ThemeColorPreset } from './hooks/use-theme'

export const version = '0.1.0'

const BiliUI = {
  version,
  install(app: App) {
    components.forEach(component => app.use(component))
    app.directive('loading', vLoading)
    app.config.globalProperties.$message = BiliMessage
    app.config.globalProperties.$notification = BiliNotification
    app.config.globalProperties.$msgbox = BiliMessageBox
    app.config.globalProperties.$alert = BiliMessageBox.alert
    app.config.globalProperties.$confirm = BiliMessageBox.confirm
    app.config.globalProperties.$prompt = BiliMessageBox.prompt
  }
}

export default BiliUI
