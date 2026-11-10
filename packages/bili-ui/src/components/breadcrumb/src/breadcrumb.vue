<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { breadcrumbProps } from './breadcrumb'
import { createBreadcrumbContext, provideBreadcrumbContext } from './context'

defineOptions({ name: 'BiliBreadcrumb' })

const props = defineProps(breadcrumbProps)

const ns = useNamespace('breadcrumb')

provideBreadcrumbContext(
  createBreadcrumbContext(
    computed(() => props.separator),
    computed(() => props.maxItems)
  )
)
</script>

<template>
  <nav :class="ns.b()" aria-label="面包屑">
    <ol :class="ns.e('list')">
      <slot />
    </ol>
  </nav>
</template>
