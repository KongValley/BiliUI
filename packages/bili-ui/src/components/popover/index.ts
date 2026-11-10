import { withInstall } from '../../utils/install'
import Popover from './src/popover.vue'
import Popconfirm from './src/popconfirm.vue'

export const BiliPopover = withInstall(Popover)
export const BiliPopconfirm = withInstall(Popconfirm)
export default BiliPopover

export * from './src/popover'
