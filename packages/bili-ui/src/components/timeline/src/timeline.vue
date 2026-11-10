<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { timelineProps } from './timeline'

defineOptions({ name: 'BiliTimeline' })

const props = defineProps(timelineProps)
const ns = useNamespace('timeline')
</script>

<template>
  <div :class="[ns.b(), ns.is('reverse', props.reverse)]" role="list">
    <slot />
  </div>
</template>
