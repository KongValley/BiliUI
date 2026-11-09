<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { layoutContentProps } from './layout'

defineOptions({ name: 'BiliLayoutContent' })

const props = defineProps(layoutContentProps)

const ns = useNamespace('layout-content')

const style = computed<CSSProperties>(() => ({
  // `0` means a flush content area; only an empty string omits the property.
  padding: props.padding === '' ? undefined : addUnit(props.padding)
}))
</script>

<template>
  <main :class="ns.b()" :style="style">
    <slot />
  </main>
</template>
