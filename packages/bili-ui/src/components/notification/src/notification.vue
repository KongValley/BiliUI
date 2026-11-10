<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useLocale } from '../../../hooks/use-config'
import BiliIcon from '../../icon/src/icon.vue'
import { notificationProps } from './notification'

defineOptions({ name: 'BiliNotification' })

const props = defineProps(notificationProps)

const emit = defineEmits<{
  close: []
  destroy: []
}>()

const ns = useNamespace('notification', props.namespace)
const locale = useLocale()

const ICONS = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
} as const

const iconName = computed(() => ICONS[props.type])

const leaving = ref(false)
const paused = ref(false)
const remaining = ref(props.duration)
let timer: ReturnType<typeof setTimeout> | null = null
let startedAt = 0

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

const startTimer = () => {
  if (props.duration <= 0) return
  startedAt = Date.now()
  timer = setTimeout(() => close(), remaining.value)
}

const pauseTimer = () => {
  if (!timer) return
  paused.value = true
  remaining.value = Math.max(0, remaining.value - (Date.now() - startedAt))
  clearTimer()
}

const resumeTimer = () => {
  if (props.duration <= 0 || !paused.value) return
  paused.value = false
  startTimer()
}

const close = () => {
  if (leaving.value) return
  leaving.value = true
  clearTimer()
  emit('close')
  // Let the leave transition finish before the imperative host unmounts us.
  setTimeout(() => emit('destroy'), 220)
}

onMounted(() => {
  startTimer()
})

onBeforeUnmount(clearTimer)

defineExpose({ close })
</script>

<template>
  <div
    :class="[ns.b(), ns.m(type), ns.is('leaving', leaving)]"
    role="alert"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <div :class="ns.e('icon')">
      <BiliIcon :name="iconName" :size="18" />
    </div>

    <div :class="ns.e('content')">
      <div v-if="title" :class="ns.e('title')">{{ title }}</div>
      <div :class="ns.e('message')">
        <slot>{{ message }}</slot>
      </div>
    </div>

    <button
      v-if="showClose"
      :class="ns.e('close')"
      type="button"
      :aria-label="locale.notificationClose"
      @click="close"
    >
      <BiliIcon name="close" :size="14" />
    </button>

    <div v-if="showProgress && duration > 0" :class="ns.e('progress')">
      <div
        :class="[ns.e('progress-bar'), ns.is('paused', paused)]"
        :style="{
          animationDuration: `${duration}ms`,
          animationPlayState: paused ? 'paused' : 'running'
        }"
      />
    </div>
  </div>
</template>
