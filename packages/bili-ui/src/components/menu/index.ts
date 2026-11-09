import { withInstall } from '../../utils/install'
import Menu from './src/menu.vue'
import MenuItem from './src/menu-item.vue'
import SubMenu from './src/sub-menu.vue'

export const BiliMenu = withInstall(Menu)
export const BiliMenuItem = withInstall(MenuItem)
export const BiliSubMenu = withInstall(SubMenu)

export default BiliMenu

export * from './src/menu'
