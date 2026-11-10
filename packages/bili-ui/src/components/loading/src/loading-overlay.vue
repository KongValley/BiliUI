<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import LoadingComponent from './loading.vue'

defineOptions({ name: 'BiliLoadingOverlay' })

const props = withDefaults(
  defineProps<{
    show?: boolean
    text?: string
    size?: 'sm' | 'md' | 'lg'
    namespace?: string
  }>(),
  {
    show: true,
    text: '',
    size: 'md',
    namespace: undefined
  }
)

const ns = useNamespace('loading', props.namespace)

const emit = defineEmits<{
  closed: []
}>()
</script>

<template>
  <Transition :name="ns.transition('loading-fade')" @after-leave="emit('closed')">
    <LoadingComponent
      v-if="show"
      :text="text"
      :size="size"
      :namespace="namespace"
      overlay
    />
  </Transition>
</template>
