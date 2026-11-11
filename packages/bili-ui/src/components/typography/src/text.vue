<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { textProps } from './typography'

defineOptions({ name: 'BiliText' })

const props = defineProps(textProps)
const ns = useNamespace('text')

const ellipsisStyle = computed<CSSProperties | undefined>(() => {
  if (typeof props.ellipsis !== 'number' || props.ellipsis <= 0) return undefined
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: String(props.ellipsis)
  }
})
</script>

<template>
  <component
    :is="tag"
    :class="[
      ns.b(),
      ns.m(type),
      ns.is('strong', strong),
      ns.is('italic', italic),
      ns.is('underline', underline),
      ns.is('delete', $props.delete),
      ns.is('mark', mark),
      ns.is('code', code),
      ns.is('ellipsis', !!ellipsis),
      ns.is('ellipsis-multiline', typeof ellipsis === 'number')
    ]"
    :style="ellipsisStyle"
  >
    <slot />
  </component>
</template>
