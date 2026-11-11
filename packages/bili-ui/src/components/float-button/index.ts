import { withInstall } from '../../utils/install'
import FloatButton from './src/float-button.vue'
import FloatButtonGroup from './src/float-button-group.vue'

export const BiliFloatButton = withInstall(FloatButton)
export const BiliFloatButtonGroup = withInstall(FloatButtonGroup)

export default BiliFloatButton

export * from './src/float-button'
