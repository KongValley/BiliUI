<script setup lang="ts">
import { computed, provide } from 'vue'
import { formListContextKey } from './types'

defineOptions({ name: 'BiliFormListItem' })

const props = defineProps<{ prefix: string }>()

provide(formListContextKey, {
  prefix: computed(() => props.prefix)
})
</script>

<template>
  <slot />
</template>
