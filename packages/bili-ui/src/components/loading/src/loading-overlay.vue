<script setup lang="ts">
import LoadingComponent from './loading.vue'

defineOptions({ name: 'BiliLoadingOverlay' })

withDefaults(
  defineProps<{
    show?: boolean
    text?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    show: true,
    text: '',
    size: 'md'
  }
)

const emit = defineEmits<{
  closed: []
}>()
</script>

<template>
  <Transition name="bili-loading-fade" @after-leave="emit('closed')">
    <LoadingComponent v-if="show" :text="text" :size="size" overlay />
  </Transition>
</template>
