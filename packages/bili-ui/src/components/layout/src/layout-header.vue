<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { layoutHeaderProps } from './layout'

defineOptions({ name: 'BiliLayoutHeader' })

const props = defineProps(layoutHeaderProps)

const ns = useNamespace('layout-header')

const style = computed<CSSProperties>(() => ({
  height: addUnit(props.height)
}))
</script>

<template>
  <header :class="[ns.b(), ns.is('sticky', sticky)]" :style="style">
    <slot />
  </header>
</template>
