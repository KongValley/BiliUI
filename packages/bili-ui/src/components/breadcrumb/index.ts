import { withInstall } from '../../utils/install'
import Breadcrumb from './src/breadcrumb.vue'
import BreadcrumbItem from './src/breadcrumb-item.vue'

export const BiliBreadcrumb = withInstall(Breadcrumb)
export const BiliBreadcrumbItem = withInstall(BreadcrumbItem)
export default BiliBreadcrumb

export * from './src/breadcrumb'
