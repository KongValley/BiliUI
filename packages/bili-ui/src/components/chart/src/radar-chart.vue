<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { formatLocale, useLocale } from '../../../hooks/use-config'
import { radarChartProps, type RadarSeries } from './chart'
import {
  clamp,
  defaultNumberFormat,
  paletteColor,
  polarPoint,
  toCssSize,
  toPxNumber,
  useChartSize
} from './use-chart'
import ChartLegend from './chart-legend.vue'
import ChartTooltip from './chart-tooltip.vue'

defineOptions({ name: 'BiliRadarChart' })

const props = defineProps(radarChartProps)

const emit = defineEmits<{
  'point-click': [
    payload: { series: string; indicator: string; value: number; index: number }
  ]
}>()

const ns = useNamespace('chart')
const locale = useLocale()
const displayEmpty = computed(() => props.emptyText || locale.value.empty)
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 280))
const formatter = computed(() => props.valueFormatter ?? defaultNumberFormat)

const count = computed(() => props.indicators.length)
const hasData = computed(
  () =>
    count.value >= 3 &&
    props.series.length > 0 &&
    props.series.some(series => series.data.length > 0)
)

const legendHeight = computed(() => (props.showLegend && props.series.length > 1 ? 30 : 0))
const center = computed(() => ({
  x: width.value / 2,
  y: (height.value - legendHeight.value) / 2
}))
const radius = computed(() =>
  Math.max(
    0,
    Math.min(width.value - 128, height.value - legendHeight.value - 72) / 2
  )
)

const angleAt = (index: number): number => (index / Math.max(1, count.value)) * 360

const maxAt = (index: number): number => {
  const declared = props.indicators[index]?.max
  if (declared !== undefined && declared > 0) return declared
  const values = props.series.map(series => Number(series.data[index]) || 0)
  return Math.max(1, ...values)
}

const pointAt = (value: number, index: number) => {
  const max = maxAt(index)
  const ratio = max > 0 ? clamp(value / max, 0, 1) : 0
  return polarPoint(center.value.x, center.value.y, radius.value * ratio, angleAt(index))
}

const gridPolygons = computed(() => {
  const levels = Math.max(1, props.levels)
  return Array.from({ length: levels }, (_, levelIndex) => {
    const ratio = (levelIndex + 1) / levels
    return props.indicators
      .map((indicator, index) => {
        const point = pointAt(maxAt(index) * ratio, index)
        return `${point.x},${point.y}`
      })
      .join(' ')
  })
})

const axes = computed(() =>
  props.indicators.map((_, index) => {
    const outer = polarPoint(center.value.x, center.value.y, radius.value, angleAt(index))
    return { x: outer.x, y: outer.y }
  })
)

const labels = computed(() =>
  props.indicators.map((indicator, index) => {
    const point = polarPoint(center.value.x, center.value.y, radius.value + 18, angleAt(index))
    const dx = point.x - center.value.x
    return {
      x: point.x,
      y: point.y,
      text: indicator.name,
      anchor: dx > 1 ? 'start' : dx < -1 ? 'end' : 'middle'
    }
  })
)

interface ResolvedRadarSeries extends RadarSeries {
  color: string
  path: string
  points: Array<{ x: number; y: number; value: number }>
}

const resolvedSeries = computed<ResolvedRadarSeries[]>(() =>
  props.series.map((series, seriesIndex) => {
    const points = props.indicators.map((_, index) => {
      const value = Number(series.data[index]) || 0
      const point = pointAt(value, index)
      return { ...point, value }
    })
    return {
      ...series,
      color: series.color ?? paletteColor(seriesIndex, ns.namespace),
      path: points
        .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`)
        .join(' ')
        .concat(' Z'),
      points
    }
  })
)

const legendItems = computed(() =>
  props.series.map((series, index) => ({
    name: series.name,
    color: series.color ?? paletteColor(index, ns.namespace),
    muted: legendHoverIndex.value >= 0 && legendHoverIndex.value !== index
  }))
)

const hover = ref<{ seriesIndex: number; pointIndex: number } | null>(null)
const legendHoverIndex = ref(-1)

const handleLegendEnter = (index: number) => {
  legendHoverIndex.value = index
}

const handleLegendLeave = () => {
  legendHoverIndex.value = -1
}

const hoveredPoint = computed(() => {
  if (!hover.value) return null
  const series = resolvedSeries.value[hover.value.seriesIndex]
  const point = series?.points[hover.value.pointIndex]
  if (!series || !point) return null
  return { series, point, indicator: props.indicators[hover.value.pointIndex] }
})

const tooltip = computed(() => {
  const current = hoveredPoint.value
  if (!current) return null
  return {
    x: current.point.x,
    y: current.point.y,
    title: current.indicator?.name,
    align: current.point.x > width.value / 2 ? ('right' as const) : ('left' as const),
    rows: resolvedSeries.value.map(series => ({
      name: series.name,
      color: series.color,
      value: formatter.value(Number(series.data[hover.value!.pointIndex]) || 0)
    }))
  }
})

const handlePointClick = (series: ResolvedRadarSeries, index: number) => {
  emit('point-click', {
    series: series.name,
    indicator: props.indicators[index]?.name ?? '',
    value: Number(series.data[index]) || 0,
    index
  })
}

const canvasStyle = computed(() => ({ height: toCssSize(props.height) }))
</script>

<template>
  <div ref="rootRef" :class="ns.b()">
    <div :class="ns.e('canvas')" :style="canvasStyle">
      <svg
        v-if="hasData && width > 0"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="formatLocale(locale.radarChart, { count: indicators.length })"
      >
        <g v-if="showGrid">
          <polygon
            v-for="(points, index) in gridPolygons"
            :key="`ring-${index}`"
            :points="points"
            :class="ns.e('radar-grid')"
          />
          <line
            v-for="(axis, index) in axes"
            :key="`axis-${index}`"
            :x1="center.x"
            :y1="center.y"
            :x2="axis.x"
            :y2="axis.y"
            :class="ns.e('radar-axis')"
          />
        </g>

        <g
          v-for="(seriesItem, seriesIndex) in resolvedSeries"
          :key="seriesItem.name"
          :class="[
            ns.e('series'),
            ns.is('muted', legendHoverIndex >= 0 && legendHoverIndex !== seriesIndex)
          ]"
        >
          <path
            :d="seriesItem.path"
            :fill="seriesItem.color"
            fill-opacity="0.14"
            :stroke="seriesItem.color"
            stroke-width="2"
            stroke-linejoin="round"
          />

          <circle
            v-for="(point, pointIndex) in seriesItem.points"
            :key="pointIndex"
            :cx="point.x"
            :cy="point.y"
            :r="hover
              && hover.seriesIndex === seriesIndex
              && hover.pointIndex === pointIndex
              ? 5
              : 3.5"
            :fill="seriesItem.color"
            :class="ns.e('radar-point')"
            @mouseenter="hover = { seriesIndex, pointIndex }"
            @mouseleave="hover = null"
            @click="handlePointClick(seriesItem, pointIndex)"
          />
        </g>

        <text
          v-for="(label, index) in labels"
          :key="`label-${index}`"
          :x="label.x"
          :y="label.y"
          :class="ns.e('axis-label')"
          :text-anchor="label.anchor"
          dominant-baseline="middle"
        >
          {{ label.text }}
        </text>
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
