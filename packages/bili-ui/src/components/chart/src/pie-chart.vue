<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { pieChartProps } from './chart'
import {
  arcPath,
  defaultNumberFormat,
  paletteColor,
  polarPoint,
  toCssSize,
  toPxNumber,
  useChartSize
} from './use-chart'
import ChartLegend from './chart-legend.vue'
import ChartTooltip from './chart-tooltip.vue'

defineOptions({ name: 'BiliPieChart' })

const props = defineProps(pieChartProps)

const emit = defineEmits<{
  'slice-click': [payload: { name: string; value: number; percent: number; index: number }]
}>()

const ns = useNamespace('chart')
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 280))
const formatter = computed(() => props.valueFormatter ?? defaultNumberFormat)

const total = computed(() =>
  props.data.reduce((sum, item) => sum + (Number.isFinite(item.value) ? item.value : 0), 0)
)
const hasData = computed(() => props.data.length > 0 && total.value > 0)

const legendHeight = computed(() => (props.showLegend && props.data.length > 1 ? 48 : 0))

const radius = computed(() =>
  Math.max(0, Math.min(width.value, height.value - legendHeight.value) / 2 - 8)
)
const center = computed(() => ({
  x: width.value / 2,
  y: (height.value - legendHeight.value) / 2
}))

interface Slice {
  name: string
  value: number
  percent: number
  color: string
  path: string
  labelX: number
  labelY: number
  midAngle: number
}

const slices = computed<Slice[]>(() => {
  if (!hasData.value) return []
  const inner = Math.max(0, Math.min(props.innerRadius, 0.95)) * radius.value
  let angle = 0

  return props.data.map((item, index) => {
    const value = Number.isFinite(item.value) ? item.value : 0
    const sweep = total.value ? (value / total.value) * 360 : 0
    const start = angle
    const end = angle + sweep
    angle = end

    const midAngle = start + sweep / 2
    const labelRadius = (radius.value + inner) / 2

    return {
      name: item.name,
      value,
      percent: total.value ? (value / total.value) * 100 : 0,
      color: item.color ?? paletteColor(index),
      path: arcPath(center.value.x, center.value.y, radius.value, inner, start, end),
      midAngle,
      labelX: polarPoint(center.value.x, center.value.y, labelRadius, midAngle).x,
      labelY: polarPoint(center.value.x, center.value.y, labelRadius, midAngle).y
    }
  })
})

const legendItems = computed(() =>
  props.data.map((item, index) => ({
    name: item.name,
    color: item.color ?? paletteColor(index)
  }))
)

// ---------------------------------------------------------------- interaction

const hoverIndex = ref(-1)

const handleMove = (event: MouseEvent) => {
  if (!hasData.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left - center.value.x
  const y = event.clientY - rect.top - center.value.y
  const distance = Math.hypot(x, y)
  const inner = Math.max(0, Math.min(props.innerRadius, 0.95)) * radius.value

  if (distance > radius.value + 6 || distance < inner - 6) {
    hoverIndex.value = -1
    return
  }

  // atan2 gives -180..180 with 0 pointing right; rotate so 0 points up.
  let angle = (Math.atan2(y, x) * 180) / Math.PI + 90
  if (angle < 0) angle += 360

  let cursor = 0
  for (let index = 0; index < slices.value.length; index += 1) {
    const sweep = total.value ? (slices.value[index].value / total.value) * 360 : 0
    if (angle >= cursor && angle < cursor + sweep) {
      hoverIndex.value = index
      return
    }
    cursor += sweep
  }
  hoverIndex.value = -1
}

const handleLeave = () => {
  hoverIndex.value = -1
}

const tooltip = computed(() => {
  if (hoverIndex.value < 0) return null
  const slice = slices.value[hoverIndex.value]
  if (!slice) return null
  return {
    x: width.value / 2,
    y: (height.value - legendHeight.value) / 2,
    align: 'left' as const,
    title: slice.name,
    rows: [
      { name: '数值', value: formatter.value(slice.value), color: slice.color },
      { name: '占比', value: `${slice.percent.toFixed(1)}%` }
    ]
  }
})

const handleClick = (slice: Slice, index: number) => {
  emit('slice-click', {
    name: slice.name,
    value: slice.value,
    percent: slice.percent,
    index
  })
}

const svgStyle = computed(() => ({ height: toCssSize(props.height) }))
</script>

<template>
  <div ref="rootRef" :class="ns.b()">
    <div
      :class="ns.e('canvas')"
      :style="svgStyle"
      @mousemove="handleMove"
      @mouseleave="handleLeave"
    >
      <svg
        v-if="hasData && width > 0"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="`饼图：${data.length} 个分类`"
      >
        <g v-for="(slice, index) in slices" :key="slice.name">
          <path
            :d="slice.path"
            :fill="slice.color"
            :class="[
              ns.e('slice'),
              ns.is('active', hoverIndex === index),
              ns.is('dimmed', hoverIndex >= 0 && hoverIndex !== index)
            ]"
            @click="handleClick(slice, index)"
          />
        </g>

        <template v-if="showLabels">
          <text
            v-for="slice in slices"
            :key="`label-${slice.name}`"
            :x="slice.labelX"
            :y="slice.labelY"
            :class="ns.e('slice-label')"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ slice.percent >= 4 ? `${slice.percent.toFixed(0)}%` : '' }}
          </text>
        </template>
      </svg>

      <div v-else :class="ns.e('empty')">{{ emptyText }}</div>

      <ChartTooltip
        v-if="tooltip"
        :x="tooltip.x"
        :y="tooltip.y"
        :title="tooltip.title"
        :rows="tooltip.rows"
        :align="tooltip.align"
      />
    </div>

    <ChartLegend v-if="showLegend && data.length > 1" :items="legendItems" />
  </div>
</template>
