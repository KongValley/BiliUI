import { withInstall } from '../../utils/install'
import Splitter from './src/splitter.vue'
import SplitterPanel from './src/splitter-panel.vue'

export const BiliSplitter = withInstall(Splitter)
export const BiliSplitterPanel = withInstall(SplitterPanel)

export default BiliSplitter

export * from './src/splitter'
