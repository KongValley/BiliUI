<script setup lang="ts">
import { computed, provide, ref, type CSSProperties } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import {
  floatButtonGroupKey,
  floatButtonGroupProps
} from './float-button'

defineOptions({ name: 'BiliFloatButtonGroup' })

const props = defineProps(floatButtonGroupProps)
const ns = useNamespace('float-button-group')

provide(floatButtonGroupKey, { inGroup: ref(true) })

const style = computed<CSSProperties>(() => ({
  gap: addUnit(props.gap),
  right: addUnit(props.right),
  bottom: addUnit(props.bottom),
  zIndex: props.zIndex
}))
</script>

<template>
  <div :class="[ns.b(), ns.m(shape), ns.m(direction)]" :style="style">
    <slot />
  </div>
</template>
