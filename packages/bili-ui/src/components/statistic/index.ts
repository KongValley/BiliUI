import { withInstall } from '../../utils/install'
import Statistic from './src/statistic.vue'
import Countdown from './src/countdown.vue'

export const BiliStatistic = withInstall(Statistic)
export const BiliStatisticCountdown = withInstall(Countdown)

export default BiliStatistic

export * from './src/statistic'
export * from './src/countdown'
