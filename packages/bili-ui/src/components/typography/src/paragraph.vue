<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { paragraphProps } from './typography'

defineOptions({ name: 'BiliParagraph' })

const props = defineProps(paragraphProps)
const ns = useNamespace('paragraph')

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
  <p
    :class="[
      ns.b(),
      ns.m(type),
      ns.is('strong', strong),
      ns.is('italic', italic),
      ns.is('underline', underline),
      ns.is('delete', $props.delete),
      ns.is('spacing', spacing),
      ns.is('ellipsis', !!ellipsis),
      ns.is('ellipsis-multiline', typeof ellipsis === 'number')
    ]"
    :style="ellipsisStyle"
  >
    <slot />
  </p>
</template>
