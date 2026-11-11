import { withInstall } from '../../utils/install'
import Card from './src/card.vue'
import CardMeta from './src/card-meta.vue'
import CardGrid from './src/card-grid.vue'

export const BiliCard = withInstall(Card)
export const BiliCardMeta = withInstall(CardMeta)
export const BiliCardGrid = withInstall(CardGrid)

export default BiliCard

export * from './src/card'
export * from './src/card-meta'
export * from './src/card-grid'
