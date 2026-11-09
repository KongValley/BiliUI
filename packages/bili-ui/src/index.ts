import type { App } from 'vue'
import { components } from './components'
import { BiliMessage } from './components/message'
import { vLoading } from './components/loading'

export * from './components'
export { BiliMessage, vLoading }

export const version = '0.1.0'

const BiliUI = {
  version,
  install(app: App) {
    components.forEach(component => app.use(component))
    app.directive('loading', vLoading)
    app.config.globalProperties.$message = BiliMessage
  }
}

export default BiliUI
