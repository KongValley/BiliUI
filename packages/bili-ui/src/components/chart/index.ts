import { withInstall } from '../../utils/install'
import LineChart from './src/line-chart.vue'
import BarChart from './src/bar-chart.vue'
import PieChart from './src/pie-chart.vue'
import GaugeChart from './src/gauge-chart.vue'
import RadarChart from './src/radar-chart.vue'
import ScatterChart from './src/scatter-chart.vue'
import FunnelChart from './src/funnel-chart.vue'

export const BiliLineChart = withInstall(LineChart)
export const BiliBarChart = withInstall(BarChart)
export const BiliPieChart = withInstall(PieChart)
export const BiliGaugeChart = withInstall(GaugeChart)
export const BiliRadarChart = withInstall(RadarChart)
export const BiliScatterChart = withInstall(ScatterChart)
export const BiliFunnelChart = withInstall(FunnelChart)

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
