import { withInstall } from '../../utils/install'
import Tabs from './src/tabs.vue'
import TabPane from './src/tab-pane.vue'

export const BiliTabs = withInstall(Tabs)
export const BiliTabPane = withInstall(TabPane)
export default BiliTabs

export * from './src/tabs'
