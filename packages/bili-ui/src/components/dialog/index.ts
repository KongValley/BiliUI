import { withInstall } from '../../utils/install'
import Dialog from './src/dialog.vue'
import { BiliMessageBox } from '../message-box'

/**
 * `BiliDialog` is the declarative dialog. The imperative helpers are aliases of
 * `BiliMessageBox`, so both entry points share one implementation.
 */
export const BiliDialog = Object.assign(withInstall(Dialog), {
  alert: BiliMessageBox.alert,
  confirm: BiliMessageBox.confirm,
  prompt: BiliMessageBox.prompt,
  closeAll: BiliMessageBox.closeAll
})

export default BiliDialog

export * from './src/dialog'
