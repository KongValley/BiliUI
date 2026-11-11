<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { linkProps } from './typography'
import TypographyContent from './content.vue'

defineOptions({ name: 'BiliLink' })

const props = defineProps(linkProps)
const emit = defineEmits<{
  copy: [text: string]
  change: [value: string]
  'edit-start': []
  'edit-cancel': []
}>()

const ns = useNamespace('link')
const hasActions = computed(() => !!props.copyable || props.editable)
</script>

<template>
  <a
    :class="[
      ns.b(),
      ns.m(type),
      ns.is('underline', underline),
      ns.is('disabled', disabled),
      ns.is('ellipsis', !!ellipsis),
      ns.is('with-actions', hasActions)
    ]"
    :href="disabled ? undefined : href || undefined"
    :target="target || undefined"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
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
  </a>
</template>
