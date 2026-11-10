import { withInstall } from '../../utils/install'
import Form from './src/form.vue'
import FormItem from './src/form-item.vue'
import FormList from './src/form-list.vue'

export const BiliForm = withInstall(Form)
export const BiliFormItem = withInstall(FormItem)
export const BiliFormList = withInstall(FormList)

export default BiliForm

export * from './src/types'
export * from './src/form'
export * from './src/form-item'
export * from './src/form-list'
