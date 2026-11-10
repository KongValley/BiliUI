import { withInstall } from '../../utils/install'
import Collapse from './src/collapse.vue'
import CollapseItem from './src/collapse-item.vue'

export const BiliCollapse = withInstall(Collapse)
export const BiliCollapseItem = withInstall(CollapseItem)
export default BiliCollapse

export * from './src/collapse'
