<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import { loadingProps } from './loading'

defineOptions({ name: 'BiliLoading' })

const props = defineProps(loadingProps)

const ns = useNamespace('loading', props.namespace)
const locale = useLocale()
</script>

<template>
  <Teleport v-if="fullscreen" to="body">
    <div
      :class="[ns.b(), ns.m(size), ns.is('fullscreen', fullscreen)]"
      role="status"
      aria-live="polite"
      :aria-label="text || locale.loading"
    >
      <span :class="ns.e('spinner')" />
      <span v-if="text" :class="ns.e('text')">{{ text }}</span>
    </div>
  </Teleport>

  <div
    v-else
    :class="[ns.b(), ns.m(size), ns.is('overlay', overlay)]"
    role="status"
    aria-live="polite"
    :aria-label="text || locale.loading"
  >
    <span :class="ns.e('spinner')" />
    <span v-if="text" :class="ns.e('text')">{{ text }}</span>
  </div>
</template>
