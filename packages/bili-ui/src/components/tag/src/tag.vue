<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { tagProps } from './tag'

defineOptions({ name: 'BiliTag' })

const props = defineProps(tagProps)

const emit = defineEmits<{
  (e: 'close', event: MouseEvent): void
}>()

const ns = useNamespace('tag')
</script>

<template>
  <span
    :class="[
      ns.b(),
      ns.m(props.type),
      ns.m(props.size),
      ns.m(props.effect),
      ns.is('round', round),
      ns.is('closable', closable)
    ]"
  >
    <span :class="ns.e('content')">
      <slot />
    </span>
    <button
      v-if="closable"
      :class="ns.e('close')"
      type="button"
      aria-label="关闭"
      @click.stop="emit('close', $event)"
    >
      <BiliIcon name="close" />
    </button>
  </span>
</template>
