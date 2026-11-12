import { withInstall } from '../../utils/install'
import App from './src/app.vue'

export const BiliApp = withInstall(App)
export default BiliApp

export * from './src/app'
export * from './src/use-app'
