import { withInstall } from '../../utils/install'
import Skeleton from './src/skeleton.vue'
import SkeletonItem from './src/skeleton-item.vue'

export const BiliSkeleton = withInstall(Skeleton)
export const BiliSkeletonItem = withInstall(SkeletonItem)
export default BiliSkeleton

export * from './src/skeleton'
