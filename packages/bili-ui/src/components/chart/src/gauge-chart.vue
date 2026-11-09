<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { gaugeChartProps } from './chart'
import {
  arcPath,
  clamp,
  defaultNumberFormat,
  polarPoint,
  toCssSize,
  toPxNumber,
  useChartSize
} from './use-chart'

defineOptions({ name: 'BiliGaugeChart' })

const props = defineProps(gaugeChartProps)

const ns = useNamespace('chart')
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 220))
const formatter = computed(() => props.valueFormatter ?? defaultNumberFormat)

// A 270° arc starting at the lower-left and ending at the lower-right.
const START_ANGLE = 225
const SWEEP = 270

const ratio = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return clamp((props.value - props.min) / span, 0, 1)
})

const radius = computed(() =>
  Math.max(0, Math.min(width.value / 2, height.value / 1.7) - props.thickness)
)
const center = computed(() => ({ x: width.value / 2, y: height.value * 0.62 }))

const trackPath = computed(() =>
  arcPath(
    center.value.x,
    center.value.y,
    radius.value,
    Math.max(0, radius.value - props.thickness),
    START_ANGLE,
    START_ANGLE + SWEEP
  )
)

const valuePath = computed(() => {
  if (ratio.value <= 0) return ''
  return arcPath(
    center.value.x,
    center.value.y,
    radius.value,
    Math.max(0, radius.value - props.thickness),
    START_ANGLE,
    START_ANGLE + SWEEP * ratio.value
  )
})

const displayValue = computed(() =>
  props.valueFormatter ? formatter.value(props.value) : String(Number(props.value.toFixed(1)))
)

/** Endpoint of the value arc, used for the small knob. */
const knobPoint = computed(() =>
  polarPoint(
    center.value.x,
    center.value.y,
    radius.value - props.thickness / 2,
    START_ANGLE + SWEEP * ratio.value
  )
)

const accentColor = computed(() => props.color || 'var(--bili-chart-color-1)')
const svgStyle = computed(() => ({ height: toCssSize(props.height) }))
</script>

<template>
  <div ref="rootRef" :class="ns.b()">
    <div :class="ns.e('canvas')" :style="svgStyle">
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="`仪表盘：${props.value}${unit} / ${props.max}${unit}`"
      >
        <path :d="trackPath" :class="ns.e('gauge-track')" />
        <path
          v-if="valuePath"
          :d="valuePath"
          :fill="accentColor"
          :class="ns.e('gauge-value')"
        />

        <circle
          v-if="valuePath"
          :cx="knobPoint.x"
          :cy="knobPoint.y"
          :r="props.thickness / 2 + 1"
          :fill="accentColor"
          :class="ns.e('gauge-knob')"
        />

        <text
          :x="center.x"
          :y="center.y - 4"
          :class="ns.e('gauge-number')"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ displayValue }}<tspan :class="ns.e('gauge-unit')">{{ unit }}</tspan>
        </text>

        <text
          v-if="label"
          :x="center.x"
          :y="center.y + 26"
          :class="ns.e('gauge-label')"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ label }}
        </text>

        <text
          :x="center.x - radius + props.thickness / 2"
          :y="center.y + radius * 0.72"
          :class="ns.e('gauge-scale')"
          text-anchor="middle"
        >
          {{ formatter(props.min) }}
        </text>
        <text
          :x="center.x + radius - props.thickness / 2"
          :y="center.y + radius * 0.72"
          :class="ns.e('gauge-scale')"
          text-anchor="middle"
        >
          {{ formatter(props.max) }}
        </text>
      </svg>
    </div>
  </div>
</template>
