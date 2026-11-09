<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import type { MessageType } from './message'

defineOptions({ name: 'BiliMessageItem' })

const props = withDefaults(
  defineProps<{
    message?: string
    type?: MessageType
    duration?: number
    showClose?: boolean
    showProgress?: boolean
    pauseOnHover?: boolean
  }>(),
  {
    message: '',
    type: 'info',
    duration: 3000,
    showClose: false,
    showProgress: true,
    pauseOnHover: true
  }
)

const emit = defineEmits<{
  close: []
  destroy: []
}>()

const ns = useNamespace('message')
const visible = ref(true)
const paused = ref(false)

const iconMap: Record<MessageType, string> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
}

const iconName = computed(() => iconMap[props.type])
const isAutoClose = computed(() => props.duration > 0)
const showProgressBar = computed(() => props.showProgress && isAutoClose.value)

let timer: ReturnType<typeof setTimeout> | null = null
let startedAt = 0
let remaining = props.duration

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

const startTimer = (ms: number) => {
  if (ms <= 0) return
  startedAt = Date.now()
  timer = setTimeout(close, ms)
}

const pauseTimer = () => {
  if (!timer) return
  clearTimer()
  remaining = Math.max(0, remaining - (Date.now() - startedAt))
}

const close = () => {
  if (!visible.value) return
  clearTimer()
  visible.value = false
  emit('close')
}

const handleMouseEnter = () => {
  if (!props.pauseOnHover || !isAutoClose.value || paused.value) return
  paused.value = true
  pauseTimer()
}

const handleMouseLeave = () => {
  if (!props.pauseOnHover || !isAutoClose.value || !paused.value) return
  paused.value = false
  // Stay open if the countdown already elapsed while leaving.
  if (remaining > 0) startTimer(remaining)
  else close()
}

const progressStyle = computed(() => ({
  animationDuration: `${props.duration}ms`,
  animationPlayState: paused.value ? 'paused' : 'running'
}))

onMounted(() => {
  if (isAutoClose.value) startTimer(remaining)
})

onBeforeUnmount(clearTimer)

defineExpose({ close })
</script>

<template>
  <Transition name="bili-message" appear @after-leave="emit('destroy')">
    <div
      v-if="visible"
      :class="[ns.b(), ns.m(type), ns.is('paused', paused)]"
      role="alert"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <BiliIcon :class="ns.e('icon')" :name="iconName" />
      <span :class="ns.e('content')">{{ message }}</span>
      <button
        v-if="showClose"
        :class="ns.e('close')"
        type="button"
        aria-label="关闭"
        @click="close"
      >
        <BiliIcon name="close" />
      </button>

      <span
        v-if="showProgressBar"
        :class="ns.e('progress')"
        :style="progressStyle"
        aria-hidden="true"
      />
    </div>
  </Transition>
</template>
