import { withInstall } from '../../utils/install'
import Loading from './src/loading.vue'
import { loadingService } from './src/service'

export const BiliLoading = Object.assign(withInstall(Loading), { service: loadingService })
export default BiliLoading

export { vLoading } from './src/directive'
export { loadingService }
export * from './src/loading'
export type { LoadingServiceInstance, LoadingServiceOptions } from './src/service'
