<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import { cardGridProps } from './card-grid'

defineOptions({ name: 'BiliCardGrid' })

const props = defineProps(cardGridProps)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const ns = useNamespace('card-grid')

const handleClick = (event: MouseEvent) => {
  if (!props.hoverable) return
  emit('click', event)
}
</script>

<template>
  <div
    :class="[ns.b(), ns.is('hoverable', hoverable)]"
    :tabindex="hoverable ? 0 : undefined"
    @click="handleClick"
  >
    <slot />
  </div>
</template>
