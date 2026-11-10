<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useId } from '../../../hooks/use-id'
import { barChartProps } from './chart'
import {
  barPath,
  buildTicks,
  clamp,
  defaultNumberFormat,
  niceDomain,
  paletteColor,
  toCssSize,
  toPxNumber,
  useChartSize
} from './use-chart'
import ChartLegend from './chart-legend.vue'
import ChartTooltip from './chart-tooltip.vue'

defineOptions({ name: 'BiliBarChart' })

const props = defineProps(barChartProps)

const emit = defineEmits<{
  'bar-click': [payload: { series: string; category: string | number; value: number; index: number }]
}>()

const ns = useNamespace('chart')
const chartId = useId('bili-bar')
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 280))
const hasData = computed(
  () => props.categories.length > 0 && props.series.some(item => item.data.length > 0)
)
const formatter = computed(() => props.valueFormatter ?? defaultNumberFormat)

const padding = computed(() =>
  props.horizontal
    ? { top: 16, right: 26, bottom: 30, left: 84 }
    : { top: 16, right: 20, bottom: 30, left: 46 }
)
const legendHeight = computed(() => (props.showLegend && props.series.length > 1 ? 30 : 0))
const plotWidth = computed(() =>
  Math.max(0, width.value - padding.value.left - padding.value.right)
)
const plotHeight = computed(() =>
  Math.max(0, height.value - padding.value.top - padding.value.bottom - legendHeight.value)
)

/** Grouping: either one stack per `stack` key, or one slot per series. */
const stackGroups = computed(() => {
  if (!props.stacked) return props.series.map((_, index) => [index])
  const groups = new Map<string, number[]>()
  props.series.forEach((series, index) => {
    const key = series.stack ?? '__default__'
    const list = groups.get(key) ?? []
    list.push(index)
    groups.set(key, list)
  })
  return Array.from(groups.values())
})

const groupCount = computed(() => Math.max(1, stackGroups.value.length))

const values = computed(() => {
  if (props.stacked) {
    return props.categories.map((_, categoryIndex) =>
      stackGroups.value.reduce((total, group) => {
        const sum = group.reduce((acc, seriesIndex) => {
          const value = props.series[seriesIndex]?.data[categoryIndex]
          return acc + (Number.isFinite(value) ? (value as number) : 0)
        }, 0)
        return total + sum
      }, 0)
    )
  }
  return props.series.flatMap(series => series.data.filter(value => Number.isFinite(value)))
})

const domain = computed(() =>
  niceDomain(values.value, {
    min: props.min ?? 0,
    max: props.max,
    beginAtZero: true
  })
)
const ticks = computed(() => buildTicks(domain.value[0], domain.value[1], 4))

const valueRatio = (value: number): number => {
  const [low, high] = domain.value
  return high === low ? 0 : clamp((value - low) / (high - low), 0, 1)
}

const bandSize = computed(() =>
  (props.horizontal ? plotHeight.value : plotWidth.value) / Math.max(1, props.categories.length)
)
const groupSize = computed(() => (bandSize.value * 0.66) / groupCount.value)
const barThickness = computed(() => Math.max(2, groupSize.value * 0.82))

interface BarRect {
  path: string
  x: number
  y: number
  width: number
  height: number
  gradientId: string
  seriesIndex: number
  seriesName: string
  value: number
  categoryIndex: number
}

const bars = computed<BarRect[]>(() => {
  const result: BarRect[] = []
  const baseline = valueRatio(0)

  props.categories.forEach((_, categoryIndex) => {
    stackGroups.value.forEach((group, groupIndex) => {
      // Only the cap of a stack gets rounded; lower segments stay square so
      // neighbouring segments meet seamlessly.
      let topSeriesIndex = -1
      if (props.stacked) {
        group.forEach(seriesIndex => {
          const value = props.series[seriesIndex]?.data[categoryIndex]
          if (Number.isFinite(value) && value !== 0) topSeriesIndex = seriesIndex
        })
      }

      let stackOffset = 0
      group.forEach(seriesIndex => {
        const series = props.series[seriesIndex]
        if (!series) return
        const value = series.data[categoryIndex]
        if (!Number.isFinite(value)) return

        const start = props.stacked ? stackOffset : baseline
        const end = props.stacked ? stackOffset + valueRatio(value) : valueRatio(value)
        stackOffset = end

        const from = Math.min(start, end)
        const to = Math.max(start, end)
        const offsetInBand = (bandSize.value - groupSize.value * groupCount.value) / 2
        const offset =
          offsetInBand + groupIndex * groupSize.value + (groupSize.value - barThickness.value) / 2

        const geometry = props.horizontal
          ? {
              x: from * plotWidth.value,
              y: categoryIndex * bandSize.value + offset,
              width: Math.max(1, (to - from) * plotWidth.value),
              height: barThickness.value
            }
          : {
              x: categoryIndex * bandSize.value + offset,
              y: plotHeight.value - to * plotHeight.value,
              width: barThickness.value,
              height: Math.max(1, (to - from) * plotHeight.value)
            }

        const radius =
          props.stacked && seriesIndex !== topSeriesIndex ? 0 : props.borderRadius

        result.push({
          path: barPath(
            geometry.x,
            geometry.y,
            geometry.width,
            geometry.height,
            radius,
            props.horizontal
          ),
          ...geometry,
          gradientId: `${chartId}-bar-${seriesIndex}`,
          seriesIndex,
          seriesName: series.name,
          value,
          categoryIndex
        })
      })
    })
  })

  return result
})

const legendItems = computed(() =>
  props.series.map((series, index) => ({
    name: series.name,
    color: series.color ?? paletteColor(index)
  }))
)

const categoryCenter = (index: number): number => index * bandSize.value + bandSize.value / 2

// ---------------------------------------------------------------- interaction

const hover = ref<{ categoryIndex: number; x: number; y: number } | null>(null)
const legendHoverIndex = ref(-1)

const handleMove = (event: MouseEvent) => {
  if (!hasData.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const pointerX = event.clientX - rect.left
  const pointerY = event.clientY - rect.top
  const localX = pointerX - padding.value.left
  const localY = pointerY - padding.value.top

  const index = props.horizontal
    ? clamp(Math.floor(localY / Math.max(1, bandSize.value)), 0, props.categories.length - 1)
    : clamp(Math.floor(localX / Math.max(1, bandSize.value)), 0, props.categories.length - 1)

  hover.value = { categoryIndex: index, x: pointerX, y: pointerY }
}

const handleLeave = () => {
  hover.value = null
}

const handleLegendEnter = (index: number) => {
  legendHoverIndex.value = index
}

const handleLegendLeave = () => {
  legendHoverIndex.value = -1
}

/** Soft highlight band behind the hovered category. */
const hoverBand = computed(() => {
  if (!hover.value) return null
  const index = hover.value.categoryIndex
  const inset = 3
  return props.horizontal
    ? {
        x: 0,
        y: index * bandSize.value + inset,
        width: plotWidth.value,
        height: Math.max(0, bandSize.value - inset * 2)
      }
    : {
        x: index * bandSize.value + inset,
        y: 0,
        width: Math.max(0, bandSize.value - inset * 2),
        height: plotHeight.value
      }
})

const tooltip = computed(() => {
  if (!hover.value) return null
  const index = hover.value.categoryIndex
  const rows = props.series.map((series, seriesIndex) => {
    const value = series.data[index]
    return {
      name: series.name,
      color: series.color ?? paletteColor(seriesIndex),
      value: Number.isFinite(value) ? formatter.value(value) : '-'
    }
  })

  // Follow the cursor but keep the whole card inside the canvas.
  const cardHeight = 40 + rows.length * 17
  return {
    x: hover.value.x,
    y: clamp(hover.value.y, cardHeight / 2 + 6, height.value - cardHeight / 2 - 6),
    align: hover.value.x > width.value - 170 ? ('right' as const) : ('left' as const),
    vertical: 'center' as const,
    title: String(props.categories[index] ?? ''),
    rows
  }
})

const handleBarClick = (bar: BarRect) => {
  emit('bar-click', {
    series: bar.seriesName,
    category: props.categories[bar.categoryIndex],
    value: bar.value,
    index: bar.categoryIndex
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
        :class="ns.is('horizontal', horizontal)"
        role="img"
        :aria-label="`柱状图：${categories.length} 个分类，${series.length} 个系列`"
      >
        <defs>
          <linearGradient
            v-for="(seriesItem, index) in series"
            :id="`${chartId}-bar-${index}`"
            :key="`gradient-${index}`"
            :x1="0"
            :y1="0"
            :x2="horizontal ? 1 : 0"
            :y2="horizontal ? 0 : 1"
          >
            <stop
              offset="0%"
              :style="{ stopColor: seriesItem.color ?? paletteColor(index), stopOpacity: 1 }"
            />
            <stop
              offset="100%"
              :style="{ stopColor: seriesItem.color ?? paletteColor(index), stopOpacity: 0.72 }"
            />
          </linearGradient>
        </defs>

        <g :transform="`translate(${padding.left}, ${padding.top})`">
          <rect
            v-if="hoverBand"
            :key="hover?.categoryIndex"
            :x="hoverBand.x"
            :y="hoverBand.y"
            :width="hoverBand.width"
            :height="hoverBand.height"
            rx="6"
            :class="ns.e('band')"
          />

          <g v-if="showGrid" :class="ns.e('grid')">
            <template v-if="horizontal">
              <line
                v-for="tick in ticks"
                :key="`grid-${tick}`"
                :x1="valueRatio(tick) * plotWidth"
                :x2="valueRatio(tick) * plotWidth"
                :y1="0"
                :y2="plotHeight"
                :class="ns.e('grid-line')"
              />
            </template>
            <template v-else>
              <line
                v-for="tick in ticks"
                :key="`grid-${tick}`"
                :x1="0"
                :x2="plotWidth"
                :y1="plotHeight - valueRatio(tick) * plotHeight"
                :y2="plotHeight - valueRatio(tick) * plotHeight"
                :class="ns.e('grid-line')"
              />
            </template>
          </g>

          <template v-if="horizontal">
            <text
              v-for="tick in ticks"
              :key="`label-${tick}`"
              :x="valueRatio(tick) * plotWidth"
              :y="plotHeight + 20"
              :class="ns.e('axis-label')"
              text-anchor="middle"
            >
              {{ formatter(tick) }}
            </text>
            <text
              v-for="(category, index) in categories"
              :key="`cat-${index}`"
              :x="-12"
              :y="categoryCenter(index)"
              :class="ns.e('axis-label')"
              text-anchor="end"
              dominant-baseline="middle"
            >
              {{ category }}
            </text>
          </template>
          <template v-else>
            <text
              v-for="tick in ticks"
              :key="`label-${tick}`"
              :x="-12"
              :y="plotHeight - valueRatio(tick) * plotHeight"
              :class="ns.e('axis-label')"
              text-anchor="end"
              dominant-baseline="middle"
            >
              {{ formatter(tick) }}
            </text>
            <text
              v-for="(category, index) in categories"
              :key="`cat-${index}`"
              :x="categoryCenter(index)"
              :y="plotHeight + 20"
              :class="ns.e('axis-label')"
              text-anchor="middle"
            >
              {{ category }}
            </text>
          </template>

          <path
            v-for="(bar, index) in bars"
            :key="index"
            :d="bar.path"
            :fill="`url(#${bar.gradientId})`"
            :data-x="bar.x"
            :data-y="bar.y"
            :data-width="bar.width"
            :data-height="bar.height"
            :style="{ animationDelay: `${Math.min(index, 20) * 32}ms` }"
            :class="[
              ns.e('bar'),
              ns.is('active', hover?.categoryIndex === bar.categoryIndex),
              ns.is('dimmed', hover !== null && hover.categoryIndex !== bar.categoryIndex),
              ns.is(
                'muted',
                legendHoverIndex >= 0 && legendHoverIndex !== bar.seriesIndex
              )
            ]"
            @click="handleBarClick(bar)"
          />
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
