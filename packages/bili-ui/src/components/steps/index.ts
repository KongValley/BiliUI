import { withInstall } from '../../utils/install'
import Steps from './src/steps.vue'
import Step from './src/step.vue'

export const BiliSteps = withInstall(Steps)
export const BiliStep = withInstall(Step)
export default BiliSteps

export * from './src/steps'
