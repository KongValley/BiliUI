<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { linkProps } from './typography'

defineOptions({ name: 'BiliLink' })

defineProps(linkProps)
const ns = useNamespace('link')
</script>

<template>
  <a
    :class="[
      ns.b(),
      ns.m(type),
      ns.is('underline', underline),
      ns.is('disabled', disabled),
      ns.is('ellipsis', !!ellipsis)
    ]"
    :href="disabled ? undefined : href || undefined"
    :target="target || undefined"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
  >
    <slot />
  </a>
</template>
