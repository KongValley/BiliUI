<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { breadcrumbProps } from './breadcrumb'
import { createBreadcrumbContext, provideBreadcrumbContext } from './context'

defineOptions({ name: 'BiliBreadcrumb' })

const props = defineProps(breadcrumbProps)

const ns = useNamespace('breadcrumb')
const locale = useLocale()

provideBreadcrumbContext(
  createBreadcrumbContext(
    computed(() => props.separator),
    computed(() => props.maxItems)
  )
)
</script>

<template>
  <nav :class="ns.b()" :aria-label="locale.breadcrumb">
    <ol :class="ns.e('list')">
      <slot />
    </ol>
  </nav>
</template>
