<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import BiliIcon from '../../icon/src/icon.vue'
import { alertProps } from './alert'

defineOptions({ name: 'BiliAlert' })

const props = defineProps(alertProps)

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: [event: MouseEvent]
}>()

const ns = useNamespace('alert')
const locale = useLocale()

const innerVisible = ref(props.visible ?? true)

watch(
  () => props.visible,
  value => {
    if (value !== undefined) innerVisible.value = value
  }
)

const ICONS = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
} as const

const iconName = computed(() => ICONS[props.type])

const handleClose = (event: MouseEvent) => {
  if (props.visible === undefined) innerVisible.value = false
  emit('update:visible', false)
  emit('close', event)
}
</script>

<template>
  <Transition :name="ns.transition('alert')">
    <div
      v-if="innerVisible"
      :class="[ns.b(), ns.m(type), ns.is('bordered', bordered)]"
      role="alert"
    >
      <BiliIcon v-if="showIcon" :class="ns.e('icon')" :name="iconName" />

      <div :class="ns.e('content')">
        <div v-if="title || $slots.title" :class="ns.e('title')">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="description || $slots.default" :class="ns.e('description')">
          <slot>{{ description }}</slot>
        </div>
      </div>

      <slot name="action" />

      <button
        v-if="closable"
        :class="ns.e('close')"
        type="button"
        :aria-label="locale.close"
        @click="handleClose"
      >
        <BiliIcon name="close" :size="14" />
      </button>
    </div>
  </Transition>
</template>
