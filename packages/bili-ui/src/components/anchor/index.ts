import { withInstall } from '../../utils/install'
import Anchor from './src/anchor.vue'
import AnchorLink from './src/anchor-link.vue'

export const BiliAnchor = withInstall(Anchor)
export const BiliAnchorLink = withInstall(AnchorLink)

export default BiliAnchor

export * from './src/anchor'
