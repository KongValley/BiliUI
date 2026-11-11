<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { formatLocale, useLocale } from '../../../hooks/use-config'
import { funnelChartProps } from './chart'
import {
  defaultNumberFormat,
  paletteColor,
  toCssSize,
  toPxNumber,
  useChartSize
} from './use-chart'
import ChartTooltip from './chart-tooltip.vue'

defineOptions({ name: 'BiliFunnelChart' })

const props = defineProps(funnelChartProps)

const emit = defineEmits<{
  'slice-click': [payload: { name: string; value: number; percent: number; index: number }]
}>()

const ns = useNamespace('chart')
const locale = useLocale()
const displayEmpty = computed(() => props.emptyText || locale.value.empty)
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 280))
const formatter = computed(() => props.valueFormatter ?? defaultNumberFormat)

const total = computed(() =>
  props.data.reduce((sum, item) => sum + (Number.isFinite(item.value) ? item.value : 0), 0)
)
const maxValue = computed(() =>
  Math.max(0, ...props.data.map(item => (Number.isFinite(item.value) ? item.value : 0)))
)
const hasData = computed(() => props.data.length > 0 && maxValue.value > 0)

const padding = computed(() => ({ top: 16, right: 56, bottom: 16, left: 56 }))
const plotWidth = computed(() =>
  Math.max(0, width.value - padding.value.left - padding.value.right)
)
const plotHeight = computed(() => Math.max(0, height.value - padding.value.top - padding.value.bottom))
const stageHeight = computed(() => plotHeight.value / Math.max(1, props.data.length))
const centerX = computed(() => width.value / 2)

interface Stage {
  name: string
  value: number
  percent: number
  color: string
  path: string
  centerY: number
  topWidth: number
  index: number
}

const stages = computed<Stage[]>(() => {
  const count = props.data.length
  const stageH = stageHeight.value
  const gap = Math.max(0, props.gap)
  const maxValueSafe = Math.max(1, maxValue.value)

  return props.data.map((item, index) => {
    const value = Number.isFinite(item.value) ? item.value : 0
    const nextValue = Number.isFinite(props.data[index + 1]?.value ?? 0)
      ? props.data[index + 1]?.value ?? 0
      : 0
    const topWidth = (value / maxValueSafe) * plotWidth.value
    const bottomWidth =
      index === count - 1 ? topWidth * 0.72 : (nextValue / maxValueSafe) * plotWidth.value
    const y = padding.value.top + index * stageH
    const h = Math.max(1, stageH - gap)
    const halfTop = topWidth / 2
    const halfBottom = bottomWidth / 2
    const x = centerX.value

    return {
      name: item.name,
      value,
      percent: total.value ? (value / total.value) * 100 : 0,
      color: item.color ?? paletteColor(index, ns.namespace),
      path: [
        `M${x - halfTop} ${y}`,
        `L${x + halfTop} ${y}`,
        `L${x + halfBottom} ${y + h}`,
        `L${x - halfBottom} ${y + h}`,
        'Z'
      ].join(' '),
      centerY: y + h / 2,
      topWidth,
      index
    }
  })
})

const hoverIndex = ref(-1)

const tooltip = computed(() => {
  if (hoverIndex.value < 0) return null
  const stage = stages.value[hoverIndex.value]
  if (!stage) return null
  return {
    x: centerX.value,
    y: stage.centerY,
    title: stage.name,
    align: 'left' as const,
    rows: [
      { name: locale.value.chartValue, value: formatter.value(stage.value), color: stage.color },
      { name: locale.value.chartPercent, value: `${stage.percent.toFixed(1)}%` }
    ]
  }
})

const handleClick = (stage: Stage) => {
  emit('slice-click', {
    name: stage.name,
    value: stage.value,
    percent: stage.percent,
    index: stage.index
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
        :aria-label="formatLocale(locale.funnelChart, { count: data.length })"
      >
        <g
          v-for="stage in stages"
          :key="stage.index"
          :class="ns.e('funnel-stage')"
        >
          <path
            :d="stage.path"
            :fill="stage.color"
            :class="[ns.e('funnel-polygon'), ns.is('active', hoverIndex === stage.index)]"
            @mouseenter="hoverIndex = stage.index"
            @mouseleave="hoverIndex = -1"
            @click="handleClick(stage)"
          />

          <template v-if="showLabels && stage.topWidth > 72">
            <text
              :x="centerX"
              :y="stage.centerY - 7"
              :class="ns.e('funnel-label')"
              text-anchor="middle"
            >
              {{ stage.name }}
            </text>
            <text
              :x="centerX"
              :y="stage.centerY + 11"
              :class="[ns.e('funnel-label'), ns.e('funnel-value')]"
              text-anchor="middle"
            >
              {{ stage.percent.toFixed(1) }}%
            </text>
          </template>
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
  </div>
</template>
