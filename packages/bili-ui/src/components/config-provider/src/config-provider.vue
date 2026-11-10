<script setup lang="ts">
import { computed, inject, onMounted, provide, watchEffect } from 'vue'
import {
  configContextKey,
  defaultConfig,
  setGlobalConfigNamespace,
  setGlobalLocale,
  type BiliConfig
} from '../../../hooks/use-config'
import { setGlobalNamespace } from '../../../hooks/use-namespace'
import { ensureNamespaceStyle } from '../../../hooks/use-namespace-style'
import { configProviderProps } from './config-provider'

defineOptions({ name: 'BiliConfigProvider' })

const props = defineProps(configProviderProps)

// Read only a real ancestor provider; the global fallback is an output of this
// component, so depending on it would make the watcher below self-triggering.
const parent = inject(configContextKey, null)

const config = computed<BiliConfig>(() => {
  const base = parent?.value ?? defaultConfig
  return {
    size: props.size ?? base.size,
    zIndex: props.zIndex ?? base.zIndex,
    namespace: props.namespace ?? base.namespace,
    locale: {
      ...base.locale,
      ...(props.locale ?? {})
    }
  }
})

watchEffect(() => {
  setGlobalNamespace(config.value.namespace)
  setGlobalConfigNamespace(config.value.namespace)
  setGlobalLocale(config.value.locale)
  ensureNamespaceStyle(config.value.namespace)
})

onMounted(() => ensureNamespaceStyle(config.value.namespace))

provide(configContextKey, config)
</script>

<template>
  <slot />
</template>
