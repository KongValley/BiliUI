<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { getIcon, type IconMode, type IconSource } from './icons'

defineOptions({ name: 'BiliIcon' })

const props = withDefaults(
  defineProps<{
    /** Name of a built-in or registered custom icon. */
    name?: string
    size?: string | number
    color?: string
    spin?: boolean
    /** Inline icon source — an array of path `d` values or a full definition. */
    icon?: IconSource
    /** Overrides the icon's own mode, e.g. to render a filled icon. */
    mode?: IconMode
    /** Overrides the icon's own viewBox, defaults to `0 0 24 24`. */
    viewBox?: string
    /** Overrides the icon's own stroke width. */
    strokeWidth?: number
  }>(),
  {
    name: undefined,
    size: undefined,
    color: undefined,
    spin: false,
    icon: undefined,
    mode: undefined,
    viewBox: undefined,
    strokeWidth: undefined
  }
)

const ns = useNamespace('icon')

// An inline `icon` wins over a registered name so slots and props can coexist.
const definition = computed(() => {
  if (props.icon) {
    return Array.isArray(props.icon) ? { paths: props.icon } : props.icon
  }
  return props.name ? getIcon(props.name) : undefined
})

const isFilled = computed(() => (props.mode ?? definition.value?.mode) === 'fill')

const paths = computed(() => definition.value?.paths ?? [])
const rawContent = computed(() => definition.value?.content ?? '')

const resolvedViewBox = computed(() => props.viewBox ?? definition.value?.viewBox ?? '0 0 24 24')
const resolvedStrokeWidth = computed(() => props.strokeWidth ?? definition.value?.strokeWidth ?? 2)

const style = computed(() => ({
  fontSize: props.size !== undefined ? addUnit(props.size) : undefined,
  color: props.color
}))
</script>

<template>
  <svg
    :class="[ns.b(), ns.is('spin', spin), ns.is('fill', isFilled)]"
    :style="style"
    :viewBox="resolvedViewBox"
    :fill="isFilled ? 'currentColor' : 'none'"
    :stroke="isFilled ? 'none' : 'currentColor'"
    :stroke-width="isFilled ? undefined : resolvedStrokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, index) in paths" :key="index" :d="d" />
    <!-- Raw markup is supplied by the app author, never by remote content. -->
    <g v-if="rawContent" v-html="rawContent" />
  </svg>
</template>
