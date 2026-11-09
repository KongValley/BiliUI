<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'

defineOptions({ name: 'BiliDivider' })

const props = withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    contentPosition?: 'left' | 'center' | 'right'
    dashed?: boolean
  }>(),
  {
    direction: 'horizontal',
    contentPosition: 'center',
    dashed: false
  }
)

const ns = useNamespace('divider')
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(props.direction),
      ns.m(`content-${contentPosition}`),
      ns.is('dashed', dashed),
      ns.is('with-text', !!$slots.default && props.direction === 'horizontal')
    ]"
    role="separator"
  >
    <span v-if="$slots.default && direction === 'horizontal'" :class="ns.e('text')">
      <slot />
    </span>
  </div>
</template>
