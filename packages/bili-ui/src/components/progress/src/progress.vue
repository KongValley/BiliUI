<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useId } from '../../../hooks/use-id'
import { progressProps } from './progress'

defineOptions({ name: 'BiliProgress' })

const props = defineProps(progressProps)

const ns = useNamespace('progress')
const gradientId = useId('bili-progress')

const clampPercent = (value: number): number => Math.min(100, Math.max(0, value))

const percent = computed(() => clampPercent(props.percentage))
const secondPercent = computed(() => clampPercent(props.successPercentage))

const resolvedStatus = computed(() => {
  if (props.status !== 'normal') return props.status
  if (percent.value >= 100) return 'success'
  return 'normal'
})

const text = computed(() => {
  if (props.format) return props.format(percent.value)
  return `${percent.value}%`
})

const isCircle = computed(() => props.type !== 'line')

const stroke = computed(() => props.strokeWidth ?? (isCircle.value ? 6 : 8))

// Circle geometry: `dashboard` leaves a 90° gap at the bottom.
const geometry = computed(() => {
  const size = props.size
  const radius = (size - stroke.value) / 2
  const circumference = 2 * Math.PI * radius
  const sweep = props.type === 'dashboard' ? 0.75 : 1
  const length = circumference * sweep
  const gap = circumference - length

  return { size, radius, circumference, length, gap, sweep }
})

const circleStyle = computed(() => {
  const { size } = geometry.value
  return { width: `${size}px`, height: `${size}px` }
})

const trackDash = computed(() => {
  const { circumference, length, gap } = geometry.value
  return `${length} ${gap === 0 ? circumference : gap}`
})

const fillDash = computed(() => {
  const { length } = geometry.value
  return `${(percent.value / 100) * length} ${length}`
})

const secondDash = computed(() => {
  const { length } = geometry.value
  return `${(secondPercent.value / 100) * length} ${length}`
})

const lineStyle = computed(() => ({
  height: `${stroke.value}px`,
  borderRadius: props.round ? '999px' : '0'
}))

const barStyle = computed<CSSProperties>(() => ({
  width: `${percent.value}%`,
  borderRadius: props.round ? '999px' : '0'
}))

const secondBarStyle = computed<CSSProperties>(() => ({
  width: `${Math.min(secondPercent.value, percent.value)}%`,
  borderRadius: props.round ? '999px' : '0'
}))

const customColor = computed(() => props.color || '')
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(type),
      ns.m(resolvedStatus),
      ns.is('custom-color', !!customColor)
    ]"
  >
    <template v-if="!isCircle">
      <div :class="[ns.e('bar'), ns.is('striped', striped && !stripedAnimated)]" :style="lineStyle">
        <div
          :class="[
            ns.e('inner'),
            ns.is('striped', stripedAnimated),
            ns.is('second', secondPercent > 0)
          ]"
          :style="[barStyle, customColor ? { backgroundColor: customColor } : {}]"
        >
          <div
            v-if="secondPercent > 0"
            :class="ns.e('second')"
            :style="secondBarStyle"
          />
        </div>
      </div>
      <span v-if="showText" :class="ns.e('text')">{{ text }}</span>
    </template>

    <template v-else>
      <div :class="ns.e('circle')" :style="circleStyle">
        <svg
          :width="geometry.size"
          :height="geometry.size"
          :viewBox="`0 0 ${geometry.size} ${geometry.size}`"
          role="img"
          :aria-label="`进度 ${percent}%`"
        >
          <defs>
            <linearGradient v-if="customColor" :id="gradientId" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" :style="{ stopColor: customColor, stopOpacity: 0.75 }" />
              <stop offset="100%" :style="{ stopColor: customColor }" />
            </linearGradient>
          </defs>

          <g
            :transform="
              type === 'dashboard'
                ? `rotate(135 ${geometry.size / 2} ${geometry.size / 2})`
                : `rotate(-90 ${geometry.size / 2} ${geometry.size / 2})`
            "
          >
            <circle
              :cx="geometry.size / 2"
              :cy="geometry.size / 2"
              :r="geometry.radius"
              fill="none"
              stroke-width="0"
              :class="ns.e('circle-track')"
            />
            <circle
              :cx="geometry.size / 2"
              :cy="geometry.size / 2"
              :r="geometry.radius"
              :class="ns.e('circle-track')"
              fill="none"
              :stroke-width="stroke"
              :stroke-dasharray="trackDash"
            />
            <circle
              v-if="secondPercent > 0"
              :cx="geometry.size / 2"
              :cy="geometry.size / 2"
              :r="geometry.radius"
              :class="ns.e('circle-second')"
              fill="none"
              :stroke-width="stroke"
              :stroke-dasharray="secondDash"
            />
            <circle
              :cx="geometry.size / 2"
              :cy="geometry.size / 2"
              :r="geometry.radius"
              :class="ns.e('circle-inner')"
              fill="none"
              :stroke="customColor ? `url(#${gradientId})` : undefined"
              :stroke-width="stroke"
              :stroke-linecap="round ? 'round' : 'butt'"
              :stroke-dasharray="fillDash"
            />
          </g>
        </svg>

        <span v-if="showText" :class="ns.e('circle-text')">{{ text }}</span>
      </div>
    </template>
  </div>
</template>
