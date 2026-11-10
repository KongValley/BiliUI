<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { descriptionsItemProps } from './descriptions'
import { useDescriptionsContext } from './context'

defineOptions({ name: 'BiliDescriptionsItem' })

const props = defineProps(descriptionsItemProps)

const ns = useNamespace('descriptions-item')
const descriptions = useDescriptionsContext()

const key = Symbol('bili-descriptions-item')

const span = computed(() => {
  const columns = descriptions.column.value === 'auto'
    ? Math.max(1, descriptions.items.value.length)
    : Math.max(1, descriptions.column.value)
  return Math.min(Math.max(1, props.span), columns)
})

const style = computed(() => ({ gridColumn: `span ${span.value}` }))

const labelStyle = computed(() => {
  const width = addUnit(props.labelWidth || descriptions.labelWidth.value)
  return width ? { width } : undefined
})

onMounted(() => {
  descriptions.register({
    key,
    label: props.label,
    span: props.span,
    labelWidth: props.labelWidth
  })
})

onBeforeUnmount(() => descriptions.unregister(key))
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.is('bordered', descriptions.bordered.value),
      ns.is('vertical', descriptions.direction.value === 'vertical')
    ]"
    :style="style"
  >
    <div :class="ns.e('label')" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </div>
    <div :class="ns.e('content')">
      <slot />
    </div>
  </div>
</template>
