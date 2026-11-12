<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { flexProps, type FlexAlign, type FlexGap, type FlexJustify } from './flex'

defineOptions({ name: 'BiliFlex' })

const props = defineProps(flexProps)

const ns = useNamespace('flex')

const gapMap: Record<string, string> = {
  small: '8px',
  middle: '16px',
  large: '24px'
}

const justifyMap: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  'flex-start': 'flex-start',
  'flex-end': 'flex-end'
}

const alignMap: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  'flex-start': 'flex-start',
  'flex-end': 'flex-end'
}

const resolveGap = (gap: FlexGap | undefined): string | undefined => {
  if (gap === undefined) return undefined
  if (typeof gap === 'number') return addUnit(gap)
  return gapMap[gap] ?? gap
}

const resolveJustify = (justify: FlexJustify | undefined): string | undefined => {
  if (!justify) return undefined
  return justifyMap[justify] ?? justify
}

const resolveAlign = (align: FlexAlign | undefined): string | undefined => {
  if (!align) return undefined
  return alignMap[align] ?? align
}

const flexWrap = computed(() => {
  if (props.wrap === true) return 'wrap'
  if (props.wrap === false || props.wrap === undefined) return undefined
  return props.wrap
})

const style = computed<CSSProperties>(() => ({
  flexDirection: props.vertical ? 'column' : undefined,
  flexWrap: flexWrap.value,
  justifyContent: resolveJustify(props.justify),
  alignItems: resolveAlign(props.align),
  gap: resolveGap(props.gap),
  flex: props.flex === undefined ? undefined : String(props.flex)
}))
</script>

<template>
  <component
    :is="component"
    :class="[ns.b(), ns.is('vertical', vertical), ns.is('wrap', flexWrap === 'wrap' || flexWrap === 'wrap-reverse')]"
    :style="style"
  >
    <slot />
  </component>
</template>
