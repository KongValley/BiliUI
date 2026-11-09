<script setup lang="ts">
import { computed, inject, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { colProps } from './grid'
import { rowContextKey } from './context'

defineOptions({ name: 'BiliCol' })

const props = defineProps(colProps)

const ns = useNamespace('col')
const row = inject(rowContextKey, null)

type ResponsiveValue = number | { span?: number; offset?: number } | undefined

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const

// Screen size classes are generated in SCSS: `bili-col--md-12`, `bili-col--md-offset-4`.
const responsiveClasses = computed(() => {
  const classes: string[] = []
  for (const bp of breakpoints) {
    const value = props[bp] as ResponsiveValue
    if (value === undefined) continue
    const span = typeof value === 'number' ? value : value.span
    const offset = typeof value === 'number' ? undefined : value.offset
    if (span !== undefined) classes.push(ns.m(`${bp}-${span}`))
    if (offset !== undefined) classes.push(ns.m(`${bp}-offset-${offset}`))
  }
  return classes
})

const style = computed<CSSProperties>(() => {
  const [horizontal] = row ? row.gutter() : [0, 0]
  return {
    // Each column pads half the gutter; the row pulls the edges back.
    paddingLeft: horizontal ? `${horizontal / 2}px` : undefined,
    paddingRight: horizontal ? `${horizontal / 2}px` : undefined,
    left: props.push ? `${(props.push / 24) * 100}%` : undefined,
    right: props.pull ? `${(props.pull / 24) * 100}%` : undefined,
    marginLeft: props.offset ? `${(props.offset / 24) * 100}%` : undefined
  }
})
</script>

<template>
  <div :class="[ns.b(), ns.m(`${span}`), ...responsiveClasses]" :style="style">
    <slot />
  </div>
</template>
