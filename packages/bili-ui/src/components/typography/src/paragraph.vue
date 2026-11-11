<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { paragraphProps } from './typography'
import TypographyContent from './content.vue'

defineOptions({ name: 'BiliParagraph' })

const props = defineProps(paragraphProps)
const emit = defineEmits<{
  copy: [text: string]
  change: [value: string]
  'edit-start': []
  'edit-cancel': []
}>()

const ns = useNamespace('paragraph')
const hasActions = computed(() => !!props.copyable || props.editable)

const ellipsisStyle = computed<CSSProperties | undefined>(() => {
  if (typeof props.ellipsis !== 'number' || props.ellipsis <= 0) return undefined
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: String(props.ellipsis)
  }
})
</script>

<template>
  <p
    :class="[
      ns.b(),
      ns.m(type),
      ns.is('strong', strong),
      ns.is('italic', italic),
      ns.is('underline', underline),
      ns.is('delete', $props.delete),
      ns.is('spacing', spacing),
      ns.is('ellipsis', !!ellipsis),
      ns.is('ellipsis-multiline', typeof ellipsis === 'number'),
      ns.is('with-actions', hasActions)
    ]"
    :style="ellipsisStyle"
  >
    <TypographyContent
      v-if="hasActions"
      :copyable="copyable"
      :editable="editable"
      @copy="emit('copy', $event)"
      @change="emit('change', $event)"
      @edit-start="emit('edit-start')"
      @edit-cancel="emit('edit-cancel')"
    >
      <slot />
    </TypographyContent>
    <slot v-else />
  </p>
</template>
