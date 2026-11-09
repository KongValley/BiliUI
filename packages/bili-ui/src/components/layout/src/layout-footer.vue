<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { layoutFooterProps } from './layout'

defineOptions({ name: 'BiliLayoutFooter' })

const props = defineProps(layoutFooterProps)

const ns = useNamespace('layout-footer')

const style = computed<CSSProperties>(() => ({
  height: props.height === undefined ? undefined : addUnit(props.height)
}))
</script>

<template>
  <footer :class="ns.b()" :style="style">
    <slot />
  </footer>
</template>
