<script setup lang="ts">
import { computed, inject, onMounted, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { layoutAsideProps } from './layout'
import { layoutContextKey } from './context'

defineOptions({ name: 'BiliLayoutAside' })

const props = defineProps(layoutAsideProps)

const ns = useNamespace('layout-aside')
const context = inject(layoutContextKey, null)

// Mutating parent state during setup triggers Vue's "recursive update" warning,
// so the registration happens once this aside is actually mounted.
onMounted(() => context?.registerAside())

const currentWidth = computed(() => (props.collapsed ? props.collapsedWidth : props.width))

const style = computed<CSSProperties>(() => ({
  width: addUnit(currentWidth.value),
  flexBasis: addUnit(currentWidth.value)
}))
</script>

<template>
  <aside :class="[ns.b(), ns.is('collapsed', collapsed), ns.is('sticky', sticky)]" :style="style">
    <slot />
  </aside>
</template>
