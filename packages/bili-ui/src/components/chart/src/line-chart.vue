<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { lineChartProps, type LineSeries } from './chart'
import {
  buildAreaPath,
  buildLinePath,
  buildTicks,
  clamp,
  defaultNumberFormat,
  niceDomain,
  paletteColor,
  toCssSize,
  toPxNumber,
  useChartSize,
  type Point
} from './use-chart'
import ChartLegend from './chart-legend.vue'
import ChartTooltip from './chart-tooltip.vue'

defineOptions({ name: 'BiliLineChart' })

const props = defineProps(lineChartProps)

const emit = defineEmits<{
  'point-click': [payload: { series: string; category: string | number; value: number | null; index: number }]
}>()

const ns = useNamespace('chart')
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 280))
const hasData = computed(
  () => props.categories.length > 0 && props.series.some(item => item.data.length > 0)
)

const padding = computed(() => ({ top: 16, right: 20, bottom: 30, left: 48 }))
const legendHeight = computed(() => (props.showLegend && props.series.length > 1 ? 28 : 0))
const plotWidth = computed(() =>
  Math.max(0, width.value - padding.value.left - padding.value.right)
)
const plotHeight = computed(() =>
  Math.max(0, height.value - padding.value.top - padding.value.bottom - legendHeight.value)
)

const formatter = computed(() => props.valueFormatter ?? defaultNumberFormat)

const domain = computed(() => {
  const values = props.series.flatMap(series =>
    series.data.filter((value): value is number => typeof value === 'number')
  )
  return niceDomain(values, {
    min: props.min,
    max: props.max,
    beginAtZero: props.beginAtZero
  })
})

const ticks = computed(() => buildTicks(domain.value[0], domain.value[1], 4))

const xAt = (index: number): number => {
  const count = props.categories.length
  if (count <= 1) return plotWidth.value / 2
  return (index / (count - 1)) * plotWidth.value
}

const yAt = (value: number): number => {
  const [low, high] = domain.value
  const ratio = high === low ? 0 : (value - low) / (high - low)
  return plotHeight.value - ratio * plotHeight.value
}

interface ResolvedSeries extends LineSeries {
  color: string
  segments: Point[][]
  linePath: string
  areaPaths: string[]
}

const resolvedSeries = computed<ResolvedSeries[]>(() =>
  props.series.map((series, seriesIndex) => {
    const color = series.color ?? paletteColor(seriesIndex)
    const segments: Point[][] = []
    let current: Point[] = []

    series.data.forEach((value, index) => {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        if (current.length) segments.push(current)
        current = []
        return
      }
      current.push({ x: xAt(index), y: yAt(value) })
    })
    if (current.length) segments.push(current)

    const baselineY = plotHeight.value
    return {
      ...series,
      color,
      segments,
      linePath: buildLinePath(segments, !!series.smooth),
      areaPaths: series.area
        ? segments.map(segment => buildAreaPath(segment, baselineY, !!series.smooth))
        : []
    }
  })
)

const legendItems = computed(() =>
  props.series.map((series, index) => ({
    name: series.name,
    color: series.color ?? paletteColor(index)
  }))
)

// ---------------------------------------------------------------- interaction

const hoverIndex = ref(-1)

const handleMove = (event: MouseEvent) => {
  if (!hasData.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left - padding.value.left
  const count = props.categories.length
  if (count === 1) {
    hoverIndex.value = 0
    return
  }
  const ratio = clamp(x / Math.max(1, plotWidth.value), 0, 1)
  hoverIndex.value = Math.round(ratio * (count - 1))
}

const handleLeave = () => {
  hoverIndex.value = -1
}

const tooltip = computed(() => {
  const index = hoverIndex.value
  if (index < 0 || !props.categories[index] && props.categories[index] !== 0) return null
  const rows = props.series.map((series, seriesIndex) => {
    const value = series.data[index]
    return {
      name: series.name,
      color: series.color ?? paletteColor(seriesIndex),
      value: typeof value === 'number' ? formatter.value(value) : '-'
    }
  })
  const x = padding.value.left + xAt(index)
  return {
    x,
    // Keep the card on the inner side of the right edge.
    align: x > width.value - 160 ? ('right' as const) : ('left' as const),
    title: String(props.categories[index] ?? ''),
    rows
  }
})

const activePoints = computed(() => {
  const index = hoverIndex.value
  if (index < 0) return []
  return resolvedSeries.value
    .map(series => {
      const value = series.data[index]
      if (typeof value !== 'number') return null
      return { x: xAt(index), y: yAt(value), color: series.color, name: series.name }
    })
    .filter((point): point is { x: number; y: number; color: string; name: string } => !!point)
})

const legendHeightOffset = computed(() => props.showLegend && props.series.length > 1 ? 28 : 0)

const handlePointClick = (series: ResolvedSeries, index: number) => {
  emit('point-click', {
    series: series.name,
    category: props.categories[index],
    value: series.data[index] ?? null,
    index
  })
}

const svgStyle = computed(() => ({
  height: toCssSize(props.height),
  paddingTop: '0'
}))
</script>

<template>
  <div ref="rootRef" :class="ns.b()">
    <div :class="ns.e('canvas')" :style="svgStyle" @mousemove="handleMove" @mouseleave="handleLeave">
      <svg
        v-if="hasData && width > 0"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="`折线图：${categories.length} 个分类，${series.length} 个系列`"
      >
        <g :transform="`translate(${padding.left}, ${padding.top})`">
          <!-- grid -->
          <g v-if="showGrid">
            <line
              v-for="tick in ticks"
              :key="`grid-${tick}`"
              :x1="0"
              :x2="plotWidth"
              :y1="yAt(tick)"
              :y2="yAt(tick)"
              :class="ns.e('grid-line')"
            />
          </g>

          <!-- y axis labels -->
          <text
            v-for="tick in ticks"
            :key="`label-${tick}`"
            :x="-10"
            :y="yAt(tick)"
            :class="ns.e('axis-label')"
            text-anchor="end"
            dominant-baseline="middle"
          >
            {{ formatter(tick) }}
          </text>

          <!-- x axis labels -->
          <text
            v-for="(category, index) in categories"
            :key="`cat-${index}`"
            :x="xAt(index)"
            :y="plotHeight + 18"
            :class="ns.e('axis-label')"
            text-anchor="middle"
          >
            {{ category }}
          </text>

          <g v-for="seriesItem in resolvedSeries" :key="seriesItem.name">
            <path
              v-for="(areaPath, index) in seriesItem.areaPaths"
              :key="`area-${index}`"
              :d="areaPath"
              :fill="seriesItem.color"
              :class="ns.e('area')"
            />
            <path
              :d="seriesItem.linePath"
              :stroke="seriesItem.color"
              :class="ns.e('line')"
              fill="none"
            />
          </g>

          <!-- hover guide -->
          <line
            v-if="hoverIndex >= 0"
            :x1="xAt(hoverIndex)"
            :x2="xAt(hoverIndex)"
            :y1="0"
            :y2="plotHeight"
            :class="ns.e('guide')"
          />

          <g v-if="showDots">
            <circle
              v-for="point in activePoints"
              :key="`${point.name}-${point.x}`"
              :cx="point.x"
              :cy="point.y"
              r="4"
              :fill="point.color"
              :class="ns.e('active-dot')"
            />
          </g>

          <!-- clickable points -->
          <g v-for="seriesItem in resolvedSeries" :key="`hit-${seriesItem.name}`">
            <circle
              v-for="(point, index) in seriesItem.segments.flat()"
              :key="`${seriesItem.name}-${index}`"
              :cx="point.x"
              :cy="point.y"
              r="10"
              :class="ns.e('hit-area')"
              @click="handlePointClick(seriesItem, index)"
            />
          </g>
        </g>
      </svg>

      <div v-else :class="ns.e('empty')">{{ emptyText }}</div>

      <ChartTooltip
        v-if="tooltip"
        :x="tooltip.x"
        :y="plotHeight / 2 + legendHeightOffset"
        :title="tooltip.title"
        :rows="tooltip.rows"
        :align="tooltip.align"
      />
    </div>

    <ChartLegend v-if="showLegend && series.length > 1" :items="legendItems" />
  </div>
</template>
