import { withInstall } from '../../utils/install'
import ConfigProvider from './src/config-provider.vue'

export const BiliConfigProvider = withInstall(ConfigProvider)
export default BiliConfigProvider

export * from './src/config-provider'
