<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import type { ComponentSize } from '../../../utils/types'

defineOptions({ name: 'BiliSpace' })

const props = withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    size?: number | string | ComponentSize
    align?: 'start' | 'center' | 'end' | 'baseline'
    wrap?: boolean
    fill?: boolean
  }>(),
  {
    direction: 'horizontal',
    size: 'md',
    align: undefined,
    wrap: false,
    fill: false
  }
)

const ns = useNamespace('space')

const sizeMap: Record<string, string> = {
  sm: '8px',
  md: '12px',
  lg: '16px'
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline'
} as const

const gap = computed(() => {
  if (typeof props.size === 'string' && sizeMap[props.size]) return sizeMap[props.size]
  return addUnit(props.size)
})

const style = computed(() => ({
  gap: gap.value,
  alignItems: props.align ? alignMap[props.align] : undefined
}))
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(direction),
      ns.is('wrap', wrap),
      ns.is('fill', fill)
    ]"
    :style="style"
  >
    <slot />
  </div>
</template>
