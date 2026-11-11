import { withInstall } from '../../utils/install'
import Avatar from './src/avatar.vue'
import AvatarGroup from './src/avatar-group.vue'

export const BiliAvatar = withInstall(Avatar)
export const BiliAvatarGroup = withInstall(AvatarGroup)

export default BiliAvatar

export * from './src/avatar'
export * from './src/avatar-group'
