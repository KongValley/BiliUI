<script setup lang="ts">
import { computed, provide, ref, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { layoutProps } from './layout'
import { layoutContextKey } from './context'

defineOptions({ name: 'BiliLayout' })

const props = defineProps(layoutProps)

const ns = useNamespace('layout')

// A layout nested inside a horizontal layout behaves as a flex column child,
// so `hasAside` only needs to describe its own direct children.
const hasAside = ref(false)
const registerAside = () => {
  hasAside.value = true
}

provide(layoutContextKey, { registerAside })

const style = computed<CSSProperties>(() => ({
  minHeight: props.fullHeight ? '100vh' : undefined
}))
</script>

<template>
  <section
    :class="[
      ns.b(),
      ns.m(direction),
      ns.is('has-aside', hasAside && direction === 'horizontal'),
      ns.is('full-height', fullHeight)
    ]"
    :style="style"
  >
    <slot />
  </section>
</template>
