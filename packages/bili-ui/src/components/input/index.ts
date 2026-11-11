import { withInstall } from '../../utils/install'
import Input from './src/input.vue'
import InputSearch from './src/search.vue'
import InputOtp from './src/otp.vue'

export const BiliInput = withInstall(Input)
export const BiliInputSearch = withInstall(InputSearch)
export const BiliInputOtp = withInstall(InputOtp)

export default BiliInput

export * from './src/input'
export * from './src/search'
export * from './src/otp'
