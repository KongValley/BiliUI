<script setup lang="ts">
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { buttonProps } from './button'

defineOptions({ name: 'BiliButton' })

const props = defineProps(buttonProps)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const ns = useNamespace('button')

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    :class="[
      ns.b(),
      ns.m(type),
      ns.m(size),
      ns.is('plain', plain),
      ns.is('round', round),
      ns.is('circle', circle),
      ns.is('loading', loading),
      ns.is('disabled', disabled),
      ns.is('block', block)
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <BiliIcon v-if="loading" :class="ns.e('loading')" name="loading" spin />
    <BiliIcon v-else-if="icon" :class="ns.e('icon')" :name="icon" />
    <slot name="icon" />
    <span v-if="!circle || $slots.default" :class="ns.e('text')">
      <slot />
    </span>
  </button>
</template>
