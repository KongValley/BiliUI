import type { PropType } from 'vue'

export interface LineSeries {
  name: string
  data: Array<number | null>
  /** Any CSS color; defaults to the chart palette. */
  color?: string
  /** Draw a smoothed curve through the points. */
  smooth?: boolean
  /** Fill the area below the line. */
  area?: boolean
}

export interface BarSeries {
  name: string
  data: number[]
  color?: string
  /** Series sharing a stack name are drawn on top of each other. */
  stack?: string
}

export interface PieDatum {
  name: string
  value: number
  color?: string
}

export type ChartValueFormatter = (value: number) => string

const categoriesProp = {
  type: Array as PropType<Array<string | number>>,
  default: () => []
}

const heightProp = {
  type: [String, Number] as PropType<string | number>,
  default: 280
}

const formatterProp = {
  type: Function as PropType<ChartValueFormatter>,
  default: undefined
}

export const lineChartProps = {
  categories: categoriesProp,
  series: {
    type: Array as PropType<LineSeries[]>,
    default: () => []
  },
  height: heightProp,
  /** Draw points and honour the tooltip; disable for a pure sparkline. */
  showDots: {
    type: Boolean,
    default: true
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  showGrid: {
    type: Boolean,
    default: true
  },
  /** Force the value axis to include zero. */
  beginAtZero: {
    type: Boolean,
    default: false
  },
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  valueFormatter: formatterProp,
  emptyText: {
    type: String,
    default: ''
  }
} as const

export const barChartProps = {
  categories: categoriesProp,
  series: {
    type: Array as PropType<BarSeries[]>,
    default: () => []
  },
  height: heightProp,
  /** Stack every series instead of grouping them side by side. */
  stacked: {
    type: Boolean,
    default: false
  },
  /** Draw bars from left to right with categories on the value axis. */
  horizontal: {
    type: Boolean,
    default: false
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  showGrid: {
    type: Boolean,
    default: true
  },
  borderRadius: {
    type: Number,
    default: 4
  },
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  valueFormatter: formatterProp,
  emptyText: {
    type: String,
    default: ''
  }
} as const

export const pieChartProps = {
  data: {
    type: Array as PropType<PieDatum[]>,
    default: () => []
  },
  height: heightProp,
  /** 0 renders a pie, 0.6 a donut. */
  innerRadius: {
    type: Number,
    default: 0
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  /** Draw the percentage inside slices wide enough to fit it. */
  showLabels: {
    type: Boolean,
    default: true
  },
  valueFormatter: formatterProp,
  emptyText: {
    type: String,
    default: ''
  }
} as const

export const gaugeChartProps = {
  value: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  height: heightProp,
  label: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: '%'
  },
  color: {
    type: String,
    default: ''
  },
  /** Arc thickness in px. */
  thickness: {
    type: Number,
    default: 14
  },
  valueFormatter: formatterProp
} as const

export interface RadarIndicator {
  name: string
  /** Upper bound of this axis; defaults to the largest value on the axis. */
  max?: number
}

export interface RadarSeries {
  name: string
  data: number[]
  color?: string
}

export const radarChartProps = {
  indicators: {
    type: Array as PropType<RadarIndicator[]>,
    default: () => []
  },
  series: {
    type: Array as PropType<RadarSeries[]>,
    default: () => []
  },
  height: heightProp,
  /** Number of concentric grid rings. */
  levels: {
    type: Number,
    default: 4
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  showGrid: {
    type: Boolean,
    default: true
  },
  valueFormatter: formatterProp,
  emptyText: {
    type: String,
    default: ''
  }
} as const

export interface ScatterPoint {
  x: number
  y: number
}

export interface ScatterSeries {
  name: string
  data: ScatterPoint[]
  color?: string
}

export const scatterChartProps = {
  series: {
    type: Array as PropType<ScatterSeries[]>,
    default: () => []
  },
  height: heightProp,
  showLegend: {
    type: Boolean,
    default: true
  },
  showGrid: {
    type: Boolean,
    default: true
  },
  xMin: {
    type: Number,
    default: undefined
  },
  xMax: {
    type: Number,
    default: undefined
  },
  yMin: {
    type: Number,
    default: undefined
  },
  yMax: {
    type: Number,
    default: undefined
  },
  /** Radius of each point in px. */
  pointSize: {
    type: Number,
    default: 5
  },
  valueFormatter: formatterProp,
  emptyText: {
    type: String,
    default: ''
  }
} as const

export interface FunnelDatum {
  name: string
  value: number
  color?: string
}

export const funnelChartProps = {
  data: {
    type: Array as PropType<FunnelDatum[]>,
    default: () => []
  },
  height: heightProp,
  /** Vertical gap between stages in px. */
  gap: {
    type: Number,
    default: 4
  },
  showLabels: {
    type: Boolean,
    default: true
  },
  valueFormatter: formatterProp,
  emptyText: {
    type: String,
    default: ''
  }
} as const
