<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import type { ComponentSize } from '../../../utils/types'

defineOptions({ name: 'BiliLoadingService' })

const props = withDefaults(
  defineProps<{
    show?: boolean
    text?: string
    size?: ComponentSize
    fullscreen?: boolean
    background?: string
    customClass?: string
    namespace?: string
  }>(),
  {
    show: true,
    text: '',
    size: 'md',
    fullscreen: true,
    background: '',
    customClass: '',
    namespace: undefined
  }
)

const emit = defineEmits<{ closed: [] }>()

const ns = useNamespace('loading', props.namespace)
const locale = useLocale()

const style = computed<CSSProperties>(() => ({
  background: props.background || undefined
}))
</script>

<template>
  <Transition :name="ns.transition('loading-fade')" appear @after-leave="emit('closed')">
    <div
      v-if="show"
      :class="[
        ns.b(),
        ns.m(size),
        ns.is('service'),
        ns.is('fullscreen', fullscreen),
        ns.is('overlay', !fullscreen),
        customClass
      ]"
      :style="style"
      role="status"
      aria-live="polite"
      :aria-label="text || locale.loading"
    >
      <span :class="ns.e('spinner')" />
      <span v-if="text" :class="ns.e('text')">{{ text }}</span>
    </div>
  </Transition>
</template>
