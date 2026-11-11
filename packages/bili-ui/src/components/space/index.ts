import { withInstall } from '../../utils/install'
import Space from './src/space.vue'
import SpaceCompact from './src/space-compact.vue'

export const BiliSpace = withInstall(Space)
export const BiliSpaceCompact = withInstall(SpaceCompact)

export default BiliSpace

export * from './src/space-compact'
