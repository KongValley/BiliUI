<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useId } from '../../../hooks/use-id'
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
const chartId = useId('bili-line')
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 280))
const hasData = computed(
  () => props.categories.length > 0 && props.series.some(item => item.data.length > 0)
)
const dense = computed(() => props.categories.length > 32)

const padding = computed(() => ({ top: 20, right: 20, bottom: 30, left: 46 }))
const legendHeight = computed(() => (props.showLegend && props.series.length > 1 ? 30 : 0))
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
  gradientId: string
  segments: Point[][]
  points: Point[]
  linePath: string
  areaPaths: string[]
}

const resolvedSeries = computed<ResolvedSeries[]>(() =>
  props.series.map((series, seriesIndex) => {
    const color = series.color ?? paletteColor(seriesIndex)
    const segments: Point[][] = []
    const points: Point[] = []
    let current: Point[] = []

    series.data.forEach((value, index) => {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        if (current.length) segments.push(current)
        current = []
        return
      }
      const point = { x: xAt(index), y: yAt(value) }
      current.push(point)
      points.push(point)
    })
    if (current.length) segments.push(current)

    const baselineY = plotHeight.value
    return {
      ...series,
      color,
      gradientId: `${chartId}-area-${seriesIndex}`,
      segments,
      points,
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
const legendHoverIndex = ref(-1)

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

const handleLegendEnter = (index: number) => {
  legendHoverIndex.value = index
}

const handleLegendLeave = () => {
  legendHoverIndex.value = -1
}

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

const tooltip = computed(() => {
  const index = hoverIndex.value
  if (index < 0) return null
  const category = props.categories[index]
  if (category === undefined) return null

  const rows = props.series.map((series, seriesIndex) => {
    const value = series.data[index]
    return {
      name: series.name,
      color: series.color ?? paletteColor(seriesIndex),
      value: typeof value === 'number' ? formatter.value(value) : '-'
    }
  })

  const x = padding.value.left + xAt(index)
  // Sit above the highest active point, flip below when needed, and fall back
  // to a clamped centred card when neither side has room.
  const anchorY = activePoints.value.length
    ? Math.min(...activePoints.value.map(point => point.y))
    : plotHeight.value / 2
  const lowestY = activePoints.value.length
    ? Math.max(...activePoints.value.map(point => point.y))
    : plotHeight.value / 2
  const topY = padding.value.top + anchorY
  const bottomY = padding.value.top + lowestY
  const cardHeight = 40 + rows.length * 17
  const fitsAbove = topY - cardHeight - 10 >= 0
  const fitsBelow = bottomY + cardHeight + 10 <= height.value - 4
  const vertical = fitsAbove ? ('above' as const) : fitsBelow ? ('below' as const) : ('center' as const)
  const y = fitsAbove
    ? topY
    : fitsBelow
      ? bottomY
      : clamp((topY + bottomY) / 2, cardHeight / 2 + 4, height.value - cardHeight / 2 - 4)

  return {
    x,
    y,
    align: x > width.value - 170 ? ('right' as const) : ('left' as const),
    vertical,
    title: String(category),
    rows
  }
})

const handlePointClick = (series: ResolvedSeries, index: number) => {
  emit('point-click', {
    series: series.name,
    category: props.categories[index],
    value: series.data[index] ?? null,
    index
  })
}

const canvasStyle = computed(() => ({ height: toCssSize(props.height) }))
</script>

<template>
  <div ref="rootRef" :class="ns.b()">
    <div :class="ns.e('canvas')" :style="canvasStyle" @mousemove="handleMove" @mouseleave="handleLeave">
      <svg
        v-if="hasData && width > 0"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="`折线图：${categories.length} 个分类，${series.length} 个系列`"
      >
        <defs>
          <linearGradient
            v-for="seriesItem in resolvedSeries"
            :id="seriesItem.gradientId"
            :key="seriesItem.gradientId"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" :style="{ stopColor: seriesItem.color, stopOpacity: 0.26 }" />
            <stop offset="100%" :style="{ stopColor: seriesItem.color, stopOpacity: 0 }" />
          </linearGradient>
        </defs>

        <g :transform="`translate(${padding.left}, ${padding.top})`">
          <g v-if="showGrid" :class="ns.e('grid')">
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

          <text
            v-for="tick in ticks"
            :key="`label-${tick}`"
            :x="-12"
            :y="yAt(tick)"
            :class="ns.e('axis-label')"
            text-anchor="end"
            dominant-baseline="middle"
          >
            {{ formatter(tick) }}
          </text>

          <text
            v-for="(category, index) in categories"
            :key="`cat-${index}`"
            :x="xAt(index)"
            :y="plotHeight + 20"
            :class="ns.e('axis-label')"
            text-anchor="middle"
          >
            {{ category }}
          </text>

          <g
            v-for="(seriesItem, seriesIndex) in resolvedSeries"
            :key="seriesItem.name"
            :class="[
              ns.e('series'),
              ns.is('muted', legendHoverIndex >= 0 && legendHoverIndex !== seriesIndex)
            ]"
          >
            <path
              v-for="(areaPath, index) in seriesItem.areaPaths"
              :key="`area-${index}`"
              :d="areaPath"
              :fill="`url(#${seriesItem.gradientId})`"
              :style="{ animationDelay: `${700 + seriesIndex * 80}ms` }"
              :class="ns.e('area')"
            />
            <path
              :d="seriesItem.linePath"
              :stroke="seriesItem.color"
              :style="{ animationDelay: `${seriesIndex * 80}ms` }"
              :class="ns.e('line')"
              fill="none"
              pathLength="100"
            />
            <circle
              v-for="(point, index) in dense || !showDots ? [] : seriesItem.points"
              :key="`dot-${index}`"
              :cx="point.x"
              :cy="point.y"
              r="2.4"
              :fill="seriesItem.color"
              :style="{
                animationDelay: `${
                  120 + seriesIndex * 80 + (index / Math.max(1, categories.length - 1)) * 760
                }ms`
              }"
              :class="ns.e('dot')"
            />
          </g>

          <line
            v-if="hoverIndex >= 0"
            :x1="xAt(hoverIndex)"
            :x2="xAt(hoverIndex)"
            :y1="0"
            :y2="plotHeight"
            :class="ns.e('guide')"
          />

          <g v-if="hoverIndex >= 0" :class="ns.e('active-points')">
            <circle
              v-for="point in activePoints"
              :key="`halo-${point.name}-${hoverIndex}`"
              :cx="point.x"
              :cy="point.y"
              r="9"
              :fill="point.color"
              :class="ns.e('active-halo')"
            />
            <circle
              v-for="point in activePoints"
              :key="`dot-${point.name}-${hoverIndex}`"
              :cx="point.x"
              :cy="point.y"
              r="4"
              :fill="point.color"
              :class="ns.e('active-dot')"
            />
          </g>

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

      <div v-else :class="ns.e('empty')">
        <span :class="ns.e('empty-mark')" aria-hidden="true" />
        <span>{{ emptyText }}</span>
      </div>

      <ChartTooltip
        v-if="tooltip"
        :x="tooltip.x"
        :y="tooltip.y"
        :title="tooltip.title"
        :rows="tooltip.rows"
        :align="tooltip.align"
        :vertical="tooltip.vertical"
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
