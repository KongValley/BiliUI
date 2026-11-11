<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { formatLocale, useLocale } from '../../../hooks/use-config'
import { scatterChartProps } from './chart'
import {
  buildTicks,
  defaultNumberFormat,
  niceDomain,
  paletteColor,
  toCssSize,
  toPxNumber,
  useChartSize
} from './use-chart'
import ChartLegend from './chart-legend.vue'
import ChartTooltip from './chart-tooltip.vue'

defineOptions({ name: 'BiliScatterChart' })

const props = defineProps(scatterChartProps)

const emit = defineEmits<{
  'point-click': [payload: { series: string; x: number; y: number; index: number }]
}>()

const ns = useNamespace('chart')
const locale = useLocale()
const displayEmpty = computed(() => props.emptyText || locale.value.empty)
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 280))
const formatter = computed(() => props.valueFormatter ?? defaultNumberFormat)

const hasData = computed(() =>
  props.series.some(series => series.data.some(point => Number.isFinite(point.x) && Number.isFinite(point.y)))
)

const padding = computed(() => ({ top: 20, right: 24, bottom: 34, left: 52 }))
const legendHeight = computed(() => (props.showLegend && props.series.length > 1 ? 30 : 0))
const plotWidth = computed(() => Math.max(0, width.value - padding.value.left - padding.value.right))
const plotHeight = computed(() =>
  Math.max(0, height.value - padding.value.top - padding.value.bottom - legendHeight.value)
)

const xDomain = computed(() => {
  const values = props.series.flatMap(series => series.data.map(point => point.x))
  return niceDomain(values, { min: props.xMin, max: props.xMax })
})

const yDomain = computed(() => {
  const values = props.series.flatMap(series => series.data.map(point => point.y))
  return niceDomain(values, { min: props.yMin, max: props.yMax })
})

const xTicks = computed(() => buildTicks(xDomain.value[0], xDomain.value[1], 4))
const yTicks = computed(() => buildTicks(yDomain.value[0], yDomain.value[1], 4))

const xAt = (value: number): number => {
  const [low, high] = xDomain.value
  return high === low ? plotWidth.value / 2 : ((value - low) / (high - low)) * plotWidth.value
}

const yAt = (value: number): number => {
  const [low, high] = yDomain.value
  const ratio = high === low ? 0 : (value - low) / (high - low)
  return plotHeight.value - ratio * plotHeight.value
}

interface ResolvedPoint {
  x: number
  y: number
  valueX: number
  valueY: number
  color: string
  series: string
  seriesIndex: number
  index: number
}

const resolvedSeries = computed(() =>
  props.series.map((series, seriesIndex) => ({
    ...series,
    color: series.color ?? paletteColor(seriesIndex, ns.namespace),
    points: series.data
      .map((point, index) => ({
        x: xAt(point.x),
        y: yAt(point.y),
        valueX: point.x,
        valueY: point.y,
        color: series.color ?? paletteColor(seriesIndex, ns.namespace),
        series: series.name,
        seriesIndex,
        index
      }))
      .filter(point => Number.isFinite(point.valueX) && Number.isFinite(point.valueY))
  }))
)

const allPoints = computed<ResolvedPoint[]>(() =>
  resolvedSeries.value.flatMap(series => series.points)
)

const legendItems = computed(() =>
  props.series.map((series, index) => ({
    name: series.name,
    color: series.color ?? paletteColor(index, ns.namespace),
    muted: legendHoverIndex.value >= 0 && legendHoverIndex.value !== index
  }))
)

const hover = ref<ResolvedPoint | null>(null)
const legendHoverIndex = ref(-1)

const handleLegendEnter = (index: number) => {
  legendHoverIndex.value = index
}

const handleLegendLeave = () => {
  legendHoverIndex.value = -1
}

const handleMove = (event: MouseEvent) => {
  if (!hasData.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left - padding.value.left
  const y = event.clientY - rect.top - padding.value.top

  let nearest: ResolvedPoint | null = null
  let distance = 14
  for (const point of allPoints.value) {
    const next = Math.hypot(point.x - x, point.y - y)
    if (next <= distance) {
      nearest = point
      distance = next
    }
  }
  hover.value = nearest
}

const handleLeave = () => {
  hover.value = null
}

const tooltip = computed(() => {
  if (!hover.value) return null
  return {
    x: padding.value.left + hover.value.x,
    y: padding.value.top + hover.value.y,
    title: hover.value.series,
    align:
      padding.value.left + hover.value.x > width.value - 150
        ? ('right' as const)
        : ('left' as const),
    rows: [
      { name: 'x', value: formatter.value(hover.value.valueX) },
      { name: 'y', value: formatter.value(hover.value.valueY) }
    ]
  }
})

const handleClick = (point: ResolvedPoint) => {
  emit('point-click', {
    series: point.series,
    x: point.valueX,
    y: point.valueY,
    index: point.index
  })
}

const canvasStyle = computed(() => ({ height: toCssSize(props.height) }))
</script>

<template>
  <div ref="rootRef" :class="ns.b()">
    <div
      :class="ns.e('canvas')"
      :style="canvasStyle"
      @mousemove="handleMove"
      @mouseleave="handleLeave"
    >
      <svg
        v-if="hasData && width > 0"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="
          formatLocale(locale.scatterChart, {
            count: series.reduce((sum, item) => sum + item.data.length, 0)
          })
        "
      >
        <g :transform="`translate(${padding.left}, ${padding.top})`">
          <g v-if="showGrid" :class="ns.e('grid')">
            <line
              v-for="tick in yTicks"
              :key="`gy-${tick}`"
              :x1="0"
              :x2="plotWidth"
              :y1="yAt(tick)"
              :y2="yAt(tick)"
              :class="ns.e('grid-line')"
            />
            <line
              v-for="tick in xTicks"
              :key="`gx-${tick}`"
              :x1="xAt(tick)"
              :x2="xAt(tick)"
              :y1="0"
              :y2="plotHeight"
              :class="ns.e('grid-line')"
            />
          </g>

          <text
            v-for="tick in yTicks"
            :key="`ly-${tick}`"
            :x="-12"
            :y="yAt(tick)"
            :class="ns.e('axis-label')"
            text-anchor="end"
            dominant-baseline="middle"
          >
            {{ formatter(tick) }}
          </text>

          <text
            v-for="tick in xTicks"
            :key="`lx-${tick}`"
            :x="xAt(tick)"
            :y="plotHeight + 20"
            :class="ns.e('axis-label')"
            text-anchor="middle"
          >
            {{ formatter(tick) }}
          </text>

          <g
            v-for="(seriesItem, seriesIndex) in resolvedSeries"
            :key="seriesItem.name"
            :class="[
              ns.e('series'),
              ns.is('muted', legendHoverIndex >= 0 && legendHoverIndex !== seriesIndex)
            ]"
          >
            <circle
              v-for="point in seriesItem.points"
              :key="point.index"
              :cx="point.x"
              :cy="point.y"
              :r="hover === point ? pointSize + 3 : pointSize"
              :fill="point.color"
              :class="[ns.e('scatter-point'), ns.is('active', hover === point)]"
              @click="handleClick(point)"
            />
          </g>
        </g>
      </svg>

      <div v-else :class="ns.e('empty')">
        <span :class="ns.e('empty-mark')" aria-hidden="true" />
        <span>{{ displayEmpty }}</span>
      </div>

      <ChartTooltip
        v-if="tooltip"
        :x="tooltip.x"
        :y="tooltip.y"
        :title="tooltip.title"
        :rows="tooltip.rows"
        :align="tooltip.align"
      />
    </div>

    <ChartLegend
      v-if="showLegend && series.length > 1"
      :items="legendItems"
      @item-enter="handleLegendEnter"
      @item-leave="handleLegendLeave"
    />
  </div>
</template>
