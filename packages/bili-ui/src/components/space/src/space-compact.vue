<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { spaceCompactProps } from './space-compact'

defineOptions({ name: 'BiliSpaceCompact' })

defineProps(spaceCompactProps)
const ns = useNamespace('space-compact')
</script>

<template>
  <div :class="[ns.b(), ns.m(direction), ns.is('block', block)]">
    <slot />
  </div>
</template>
