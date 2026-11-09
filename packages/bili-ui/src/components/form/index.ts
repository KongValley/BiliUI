import { withInstall } from '../../utils/install'
import Form from './src/form.vue'
import FormItem from './src/form-item.vue'

export const BiliForm = withInstall(Form)
export const BiliFormItem = withInstall(FormItem)

export default BiliForm

export * from './src/types'
export * from './src/form'
export * from './src/form-item'
