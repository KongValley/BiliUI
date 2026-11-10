<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { formatLocale, useLocale } from '../../../hooks/use-config'
import { useId } from '../../../hooks/use-id'
import { gaugeChartProps } from './chart'
import {
  arcStrokePath,
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
const locale = useLocale()
const chartId = useId('bili-gauge')
const rootRef = ref<HTMLElement | null>(null)
const { width } = useChartSize(rootRef)

const height = computed(() => toPxNumber(props.height, 240))
const formatter = computed(() => props.valueFormatter ?? defaultNumberFormat)

// A 270° arc starting at the lower-left and ending at the lower-right.
const START_ANGLE = 225
const SWEEP = 270

// Exponential follow keeps the gauge glued to the thumb during a drag: each
// input only moves the target, so there is no timed tween to restart and no
// ~200ms rubber-band lag (which reads as dropped frames).
const FOLLOW_TAU = 60
// A 34px SVG text node re-layouts on every content change; ~25fps is
// indistinguishable for digits and keeps the arc/knob at display rate.
const TEXT_INTERVAL = 40

const formatValue = (value: number): string =>
  props.valueFormatter ? props.valueFormatter(value) : String(Number(value.toFixed(1)))

const animatedValue = ref(props.value)
const displayValue = ref(formatValue(props.value))
let frame = 0
let lastFrameTime = 0
let lastTextTime = 0

const stopFollow = () => {
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
}

const syncImmediately = () => {
  stopFollow()
  animatedValue.value = props.value
  displayValue.value = formatValue(props.value)
}

const follow = (now: number) => {
  const elapsed = Math.min(64, Math.max(0, now - lastFrameTime))
  lastFrameTime = now

  const target = props.value
  const current = animatedValue.value
  const delta = target - current

  if (Math.abs(delta) < 0.05) {
    animatedValue.value = target
    displayValue.value = formatValue(target)
    frame = 0
    return
  }

  animatedValue.value = current + delta * (1 - Math.exp(-elapsed / FOLLOW_TAU))

  if (now - lastTextTime >= TEXT_INTERVAL) {
    lastTextTime = now
    displayValue.value = formatValue(animatedValue.value)
  }

  frame = requestAnimationFrame(follow)
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const restartFollow = () => {
  if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') {
    syncImmediately()
    return
  }
  // A pending frame can be dropped when the page is frozen or discarded, so
  // never treat a non-zero handle as "the loop is alive": cancel it and
  // schedule a fresh frame instead. Trusting it would wedge the gauge on a
  // stale value and ignore every later input.
  if (frame) cancelAnimationFrame(frame)
  lastFrameTime = performance.now() - 16
  lastTextTime = 0
  frame = requestAnimationFrame(follow)
}

watch(
  () => props.value,
  () => {
    if (prefersReducedMotion()) {
      syncImmediately()
      return
    }
    restartFollow()
  }
)

const resumeFollow = () => {
  if (typeof document === 'undefined' || document.visibilityState !== 'visible') return
  if (Math.abs(animatedValue.value - props.value) <= 0.05) return
  if (prefersReducedMotion()) {
    syncImmediately()
    return
  }
  restartFollow()
}

onMounted(() => {
  document.addEventListener('visibilitychange', resumeFollow)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', resumeFollow)
  stopFollow()
})

const animatedRatio = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return clamp((animatedValue.value - props.min) / span, 0, 1)
})

const showValue = computed(() => animatedRatio.value > 0)

const center = computed(() => ({ x: width.value / 2, y: height.value * 0.58 }))

// Mid-line radius: keep the round caps and the min/max labels inside the canvas.
const midRadius = computed(() => {
  const byHeight = Math.max(0, height.value - 30 - center.value.y) / Math.SQRT1_2
  const byWidth = width.value / 2 - props.thickness
  return Math.max(0, Math.min(byWidth, byHeight))
})
/**
 * Open arcs stroked along the mid-line: the thick round caps give both the
 * track and the progress bar genuine rounded ends.
 */
const trackPath = computed(() =>
  arcStrokePath(
    center.value.x,
    center.value.y,
    midRadius.value,
    START_ANGLE,
    START_ANGLE + SWEEP
  )
)

// The progress arc is real geometry, not a dash pattern: changing `d`
// invalidates the path paint reliably, whereas a stale `stroke-dasharray`
// cache could keep painting an older length while the knob had already moved.
const valuePath = computed(() => {
  const ratio = animatedRatio.value
  if (ratio <= 0) return ''
  return arcStrokePath(
    center.value.x,
    center.value.y,
    midRadius.value,
    START_ANGLE,
    START_ANGLE + SWEEP * ratio
  )
})

const knobPoint = computed(() =>
  polarPoint(
    center.value.x,
    center.value.y,
    midRadius.value,
    START_ANGLE + SWEEP * animatedRatio.value
  )
)

const startPoint = computed(() =>
  polarPoint(center.value.x, center.value.y, midRadius.value, START_ANGLE)
)
const endPoint = computed(() =>
  polarPoint(center.value.x, center.value.y, midRadius.value, START_ANGLE + SWEEP)
)

const accentColor = computed(() => props.color || `var(${ns.cssVarBlock('chart-color-1')})`)
const gradientId = computed(() => `${chartId}-gradient`)
const canvasStyle = computed(() => ({ height: toCssSize(props.height) }))
</script>

<template>
  <div ref="rootRef" :class="ns.b()">
    <div :class="ns.e('canvas')" :style="canvasStyle">
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="img"
        :aria-label="
          formatLocale(locale.gaugeChart, {
            value: props.value,
            unit,
            max: props.max
          })
        "
      >
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" :style="{ stopColor: accentColor, stopOpacity: 0.55 }" />
            <stop offset="100%" :style="{ stopColor: accentColor, stopOpacity: 1 }" />
          </linearGradient>
        </defs>

        <!-- track -->
        <path
          :d="trackPath"
          :class="ns.e('gauge-track')"
          fill="none"
          :stroke-width="thickness"
          pathLength="100"
        />

        <path
          v-if="showValue"
          :d="valuePath"
          :class="ns.e('gauge-value')"
          fill="none"
          :stroke="`url(#${gradientId})`"
          :stroke-width="thickness"
          stroke-linecap="round"
        />

        <!-- Positioned with cx/cy (not a transform) so the knob and the arc
             dash land in the same SVG repaint instead of separate layers. -->
        <circle
          v-if="showValue"
          :cx="knobPoint.x"
          :cy="knobPoint.y"
          :r="props.thickness / 2 + 2"
          :class="ns.e('gauge-knob')"
          :fill="accentColor"
        />

        <text
          :x="center.x"
          :y="center.y - 2"
          :class="ns.e('gauge-number')"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ displayValue }}<tspan :class="ns.e('gauge-unit')">{{ unit }}</tspan>
        </text>

        <text
          v-if="label"
          :x="center.x"
          :y="center.y + 28"
          :class="ns.e('gauge-label')"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ label }}
        </text>

        <text
          :x="startPoint.x"
          :y="startPoint.y + 20"
          :class="ns.e('gauge-scale')"
          text-anchor="middle"
        >
          {{ formatter(props.min) }}
        </text>
        <text
          :x="endPoint.x"
          :y="endPoint.y + 20"
          :class="ns.e('gauge-scale')"
          text-anchor="middle"
        >
          {{ formatter(props.max) }}
        </text>
      </svg>
    </div>
  </div>
</template>
