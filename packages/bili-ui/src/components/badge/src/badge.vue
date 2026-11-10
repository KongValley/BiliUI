<script setup lang="ts">
import { computed, useSlots, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { badgeProps } from './badge'

defineOptions({ name: 'BiliBadge' })

const props = defineProps(badgeProps)

const ns = useNamespace('badge')
const slots = useSlots()

const isNumber = computed(
  () => typeof props.value === 'number' && Number.isFinite(props.value as number)
)

const content = computed(() => {
  if (props.dot) return ''
  if (props.value === undefined || props.value === '') return ''
  if (isNumber.value) {
    const value = props.value as number
    return value > props.max ? `${props.max}+` : String(value)
  }
  return String(props.value)
})

const visible = computed(() => {
  if (props.hidden) return false
  if (props.dot) return true

  const value = props.value
  if (value === undefined || value === '') return false
  if (typeof value === 'number') {
    if (value === 0 && !props.showZero) return false
    return value !== 0 || props.showZero
  }
  return true
})

const hasSlot = computed(() => !!slots.default)
const isStatus = computed(() => !!props.status)

const style = computed<CSSProperties | undefined>(() => {
  if (props.color) {
    return { '--bili-badge-color': props.color } as CSSProperties
  }
  return undefined
})

const classes = computed(() => {
  if (isStatus.value) return [ns.b(), ns.m('status'), ns.m(props.status as string)]

  return [
    ns.b(),
    ns.m(props.type),
    ns.is('dot', props.dot),
    ns.is('fixed', !hasSlot.value),
    ns.is('hidden', !visible.value)
  ]
})
</script>

<template>
  <span :class="classes" :style="style">
    <template v-if="isStatus">
      <span :class="ns.e('status-dot')" aria-hidden="true" />
      <span v-if="$slots.default || value" :class="ns.e('status-text')">
        <slot>{{ value }}</slot>
      </span>
    </template>

    <template v-else>
      <slot />
      <sup v-if="visible" :class="ns.e('content')">
        <slot name="content">{{ content }}</slot>
      </sup>
    </template>
  </span>
</template>
