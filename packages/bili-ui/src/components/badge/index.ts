import { withInstall } from '../../utils/install'
import Badge from './src/badge.vue'
import BadgeRibbon from './src/ribbon.vue'

export const BiliBadge = withInstall(Badge)
export const BiliBadgeRibbon = withInstall(BadgeRibbon)

export default BiliBadge

export * from './src/badge'
export * from './src/ribbon'
