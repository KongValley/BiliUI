<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { titleProps } from './typography'

defineOptions({ name: 'BiliTitle' })

const props = defineProps(titleProps)
const ns = useNamespace('title')

const tag = computed(() => `h${props.level}`)
</script>

<template>
  <component
    :is="tag"
    :class="[ns.b(), ns.m(`level-${level}`), ns.m(type), ns.is('ellipsis', !!ellipsis)]"
  >
    <slot />
  </component>
</template>
