import { withInstall } from '../../utils/install'
import LineChart from './src/line-chart.vue'
import BarChart from './src/bar-chart.vue'
import PieChart from './src/pie-chart.vue'
import GaugeChart from './src/gauge-chart.vue'

export const BiliLineChart = withInstall(LineChart)
export const BiliBarChart = withInstall(BarChart)
export const BiliPieChart = withInstall(PieChart)
export const BiliGaugeChart = withInstall(GaugeChart)

export default BiliLineChart

export * from './src/chart'
export {
  niceDomain,
  niceStep,
  buildTicks,
  buildLinePath,
  buildAreaPath,
  arcPath,
  polarPoint,
  defaultNumberFormat
} from './src/use-chart'
