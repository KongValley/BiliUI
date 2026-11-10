import { withInstall } from '../../utils/install'
import Dropdown from './src/dropdown.vue'
import DropdownItem from './src/dropdown-item.vue'

export const BiliDropdown = withInstall(Dropdown)
export const BiliDropdownItem = withInstall(DropdownItem)
export default BiliDropdown

export * from './src/dropdown'
