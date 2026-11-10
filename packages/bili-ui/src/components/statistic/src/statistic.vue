<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { statisticProps } from './statistic'

defineOptions({ name: 'BiliStatistic' })

const props = defineProps(statisticProps)
const ns = useNamespace('statistic')

const formatted = computed(() => {
  if (props.formatter) return props.formatter(props.value)

  const source = String(props.value).trim()
  const numeric = Number(source)
  if (!Number.isFinite(numeric)) return source

  const text =
    props.precision !== undefined ? numeric.toFixed(Math.max(0, props.precision)) : source

  const negative = text.startsWith('-')
  const unsigned = negative ? text.slice(1) : text
  const [integer, decimal] = unsigned.split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator)

  return `${negative ? '-' : ''}${grouped}${
    decimal !== undefined ? `${props.decimalSeparator}${decimal}` : ''
  }`
})

const valueStyles = computed(() => ({
  color: props.color || undefined,
  ...props.valueStyle
}))
</script>

<template>
  <div :class="ns.b()">
    <div v-if="title || $slots.title" :class="ns.e('title')">
      <slot name="title">{{ title }}</slot>
    </div>

    <div :class="ns.e('value-row')">
      <span v-if="prefix || $slots.prefix" :class="ns.e('prefix')">
        <slot name="prefix">{{ prefix }}</slot>
      </span>

      <span :class="ns.e('value')" :style="valueStyles">{{ formatted }}</span>

      <span v-if="suffix || $slots.suffix" :class="ns.e('suffix')">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>
  </div>
</template>
