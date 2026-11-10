<script setup lang="ts">
import { computed, provide } from 'vue'
import { configContextKey, useConfig, type BiliConfig } from '../../../hooks/use-config'
import { configProviderProps } from './config-provider'

defineOptions({ name: 'BiliConfigProvider' })

const props = defineProps(configProviderProps)

const parent = useConfig()

const config = computed<BiliConfig>(() => ({
  size: props.size ?? parent.value.size,
  zIndex: props.zIndex ?? parent.value.zIndex,
  locale: {
    ...parent.value.locale,
    ...(props.locale ?? {})
  }
}))

provide(configContextKey, config)
</script>

<template>
  <slot />
</template>
