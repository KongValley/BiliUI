<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'

export interface TooltipRow {
  name: string
  value: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    x: number
    y: number
    title?: string
    rows: TooltipRow[]
    /** Which edge the card grows from; keeps it inside the plot area. */
    align?: 'left' | 'right'
    /** `above`/`below` pin the card to the anchor point instead of centering it. */
    vertical?: 'center' | 'above' | 'below'
  }>(),
  { title: '', align: 'left', vertical: 'center' }
)

const ns = useNamespace('chart-tooltip')

const style = computed<CSSProperties>(() => {
  const translateX = props.align === 'right' ? 'calc(-100% - 12px)' : '12px'
  const translateY =
    props.vertical === 'above' ? 'calc(-100% - 10px)' : props.vertical === 'below' ? '10px' : '-50%'

  return {
    left: `${props.x}px`,
    top: `${props.y}px`,
    transform: `translate(${translateX}, ${translateY})`
  }
})
</script>

<template>
  <div :class="ns.b()" :style="style" role="tooltip">
    <div v-if="title" :class="ns.e('title')">{{ title }}</div>
    <div v-for="row in rows" :key="row.name" :class="ns.e('row')">
      <span
        v-if="row.color"
        :class="ns.e('dot')"
        :style="{ backgroundColor: row.color }"
      />
      <span :class="ns.e('name')">{{ row.name }}</span>
      <span :class="ns.e('value')">{{ row.value }}</span>
    </div>
  </div>
</template>
