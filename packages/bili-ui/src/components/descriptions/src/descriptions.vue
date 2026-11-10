<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { descriptionsProps } from './descriptions'
import {
  descriptionsContextKey,
  provideDescriptionsContext,
  type DescriptionsContext,
  type DescriptionsItemState
} from './context'

defineOptions({ name: 'BiliDescriptions' })

const props = defineProps(descriptionsProps)

const ns = useNamespace('descriptions')
const items = ref<DescriptionsItemState[]>([])

const register = (item: DescriptionsItemState) => {
  items.value.push(item)
}

const unregister = (key: symbol) => {
  const index = items.value.findIndex(item => item.key === key)
  if (index > -1) items.value.splice(index, 1)
}

const indexOf = (key: symbol): number => items.value.findIndex(item => item.key === key)

const context: DescriptionsContext = {
  column: computed(() => props.column),
  labelWidth: computed(() => props.labelWidth),
  bordered: computed(() => props.bordered),
  direction: computed(() => props.direction),
  items,
  register,
  unregister,
  indexOf
}

provideDescriptionsContext(context)

const columnCount = computed(() =>
  props.column === 'auto' ? Math.max(1, items.value.length) : Math.max(1, props.column)
)

const rootStyle = computed(() => ({
  '--bili-descriptions-columns': String(columnCount.value)
}))

defineExpose({ context, descriptionsContextKey })
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.is('bordered', bordered),
      ns.m(direction),
      ns.m(`size-${size}`)
    ]"
    :style="rootStyle"
  >
    <div v-if="title || $slots.title || $slots.extra" :class="ns.e('header')">
      <div :class="ns.e('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.extra" :class="ns.e('extra')">
        <slot name="extra" />
      </div>
    </div>

    <div :class="ns.e('body')">
      <slot />
    </div>
  </div>
</template>
