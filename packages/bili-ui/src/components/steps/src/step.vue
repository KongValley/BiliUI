<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { stepProps, type StepStatus } from './steps'
import { resolveStatus, useStepsContext } from './context'

defineOptions({ name: 'BiliStep' })

const props = defineProps(stepProps)

const ns = useNamespace('step')
const steps = useStepsContext()

const key = Symbol('bili-step')

const index = computed(() => steps.indexOf(key))

const status = computed<StepStatus>(() => {
  if (props.status) return props.status as StepStatus
  return resolveStatus(index.value, steps.active.value, steps.processStatus.value)
})

const isLast = computed(() => index.value >= 0 && index.value === steps.size() - 1)

const iconName = computed(() => {
  if (props.icon) return props.icon
  if (status.value === 'finish') return 'check'
  if (status.value === 'error') return 'close'
  return ''
})

const handleClick = () => {
  if (!steps.clickable.value || status.value === 'wait') return
  steps.go(index.value)
}

onMounted(() => steps.register(key))
onBeforeUnmount(() => steps.unregister(key))
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(status),
      ns.is('last', isLast),
      ns.is('clickable', steps.clickable.value)
    ]"
    @click="handleClick"
  >
    <div :class="ns.e('head')">
      <div :class="ns.e('icon')">
        <BiliIcon v-if="iconName" :name="iconName" :size="14" />
        <span v-else :class="ns.e('number')">{{ index + 1 }}</span>
      </div>
      <div v-if="!steps.simple.value" :class="ns.e('line')" />
    </div>

    <div :class="ns.e('main')">
      <div :class="ns.e('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.description" :class="ns.e('description')">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>
