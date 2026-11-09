import { withInstall } from '../../utils/install'
import Row from './src/row.vue'
import Col from './src/col.vue'

export const BiliRow = withInstall(Row)
export const BiliCol = withInstall(Col)

export default BiliRow

export * from './src/grid'
