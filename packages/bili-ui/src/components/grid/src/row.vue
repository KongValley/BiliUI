<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { rowProps, type RowAlign, type RowJustify } from './grid'
import { useRowGutter } from './context'

defineOptions({ name: 'BiliRow' })

const props = defineProps(rowProps)

const { ns, rowStyle } = useRowGutter(props)

const justifyMap: Record<RowJustify, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-around': 'space-around',
  'space-between': 'space-between',
  'space-evenly': 'space-evenly'
}

const alignMap: Record<RowAlign, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
  stretch: 'stretch'
}

const style = computed<CSSProperties>(() => ({
  ...rowStyle.value,
  justifyContent: justifyMap[props.justify],
  alignItems: alignMap[props.align]
}))
</script>

<template>
  <div :class="[ns.b(), ns.is('wrap', wrap), ns.is('nowrap', !wrap)]" :style="style">
    <slot />
  </div>
</template>
