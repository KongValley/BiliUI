import { withInstall } from '../../utils/install'
import Descriptions from './src/descriptions.vue'
import DescriptionsItem from './src/descriptions-item.vue'

export const BiliDescriptions = withInstall(Descriptions)
export const BiliDescriptionsItem = withInstall(DescriptionsItem)
export default BiliDescriptions

export * from './src/descriptions'
