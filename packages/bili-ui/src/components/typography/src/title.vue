<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { titleProps } from './typography'
import TypographyContent from './content.vue'

defineOptions({ name: 'BiliTitle' })

const props = defineProps(titleProps)
const emit = defineEmits<{
  copy: [text: string]
  change: [value: string]
  'edit-start': []
  'edit-cancel': []
}>()

const ns = useNamespace('title')
const tag = computed(() => `h${props.level}`)
const hasActions = computed(() => !!props.copyable || props.editable)
</script>

<template>
  <component
    :is="tag"
    :class="[
      ns.b(),
      ns.m(`level-${level}`),
      ns.m(type),
      ns.is('ellipsis', !!ellipsis),
      ns.is('with-actions', hasActions)
    ]"
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
  </component>
</template>
