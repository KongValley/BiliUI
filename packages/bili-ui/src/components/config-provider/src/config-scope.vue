<script setup lang="ts">
import { computed, provide } from 'vue'
import { configContextKey, type BiliConfig } from '../../../hooks/use-config'

defineOptions({ name: 'BiliConfigScope' })

/**
 * Internal provider used by imperative APIs (App-scoped message, notification
 * and message box) to render their teleported content with the caller's
 * ConfigProvider settings without touching the global fallback config.
 */
const props = defineProps<{ config: BiliConfig }>()

const config = computed<BiliConfig>(() => props.config)

provide(configContextKey, config)
</script>

<template>
  <slot />
</template>
