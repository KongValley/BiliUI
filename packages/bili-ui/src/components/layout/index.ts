import { withInstall } from '../../utils/install'
import Layout from './src/layout.vue'
import LayoutHeader from './src/layout-header.vue'
import LayoutAside from './src/layout-aside.vue'
import LayoutContent from './src/layout-content.vue'
import LayoutFooter from './src/layout-footer.vue'

export const BiliLayout = withInstall(Layout)
export const BiliLayoutHeader = withInstall(LayoutHeader)
export const BiliLayoutAside = withInstall(LayoutAside)
export const BiliLayoutContent = withInstall(LayoutContent)
export const BiliLayoutFooter = withInstall(LayoutFooter)

export default BiliLayout

export * from './src/layout'
