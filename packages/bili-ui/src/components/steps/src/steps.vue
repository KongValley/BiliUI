<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { stepsProps } from './steps'
import { provideStepsContext, stepsContextKey, type StepsContext } from './context'

defineOptions({ name: 'BiliSteps' })

const props = defineProps(stepsProps)

const emit = defineEmits<{
  'update:active': [value: number]
  change: [value: number]
}>()

const ns = useNamespace('steps')
const keys = ref<symbol[]>([])

const register = (key: symbol) => {
  if (!keys.value.includes(key)) keys.value.push(key)
}

const unregister = (key: symbol) => {
  const index = keys.value.indexOf(key)
  if (index > -1) keys.value.splice(index, 1)
}

const indexOf = (key: symbol): number => keys.value.indexOf(key)
const size = (): number => keys.value.length

const go = (index: number) => {
  if (!props.clickable) return
  emit('update:active', index)
  emit('change', index)
}

const context: StepsContext = {
  active: computed(() => props.active),
  direction: computed(() => props.direction),
  processStatus: computed(() => props.processStatus),
  simple: computed(() => props.simple),
  clickable: computed(() => props.clickable),
  register,
  unregister,
  indexOf,
  size,
  go
}

provide(stepsContextKey, context)
provideStepsContext(context)

const rootStyle = computed(() =>
  props.space !== '' ? { gap: addUnit(props.space) } : undefined
)
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(direction),
      ns.is('simple', simple),
      ns.is('clickable', clickable)
    ]"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>
