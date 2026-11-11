<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { countdownProps } from './countdown'

defineOptions({ name: 'BiliStatisticCountdown' })

const props = defineProps(countdownProps)

const emit = defineEmits<{
  finish: []
}>()

const ns = useNamespace('statistic')

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
let finished = false

const target = computed(() => {
  const value = props.value
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number') return value
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
})

const remaining = computed(() => Math.max(0, target.value - now.value))
const totalSeconds = computed(() => Math.ceil(remaining.value / 1000))

const pad = (value: number) => String(value).padStart(2, '0')

const formatted = computed(() => {
  const total = totalSeconds.value
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const hasDays = props.format.includes('DD')
  const displayHours = hasDays ? hours : days * 24 + hours

  return props.format.replace(/DD|HH|mm|ss/g, token => {
    if (token === 'DD') return pad(days)
    if (token === 'HH') return pad(displayHours)
    if (token === 'mm') return pad(minutes)
    return pad(seconds)
  })
})

const valueStyles = computed(() => ({
  color: props.color || undefined,
  ...props.valueStyle
}))

const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const tick = () => {
  now.value = Date.now()
  if (remaining.value <= 0) {
    stop()
    if (!finished) {
      finished = true
      emit('finish')
    }
  }
}

const start = () => {
  stop()
  finished = false
  now.value = Date.now()
  if (remaining.value <= 0) {
    tick()
    return
  }
  timer = setInterval(tick, Math.max(16, props.interval))
}

watch(
  () => [target.value, props.autoStart, props.interval],
  () => {
    if (props.autoStart) start()
  }
)

onMounted(() => {
  now.value = Date.now()
  if (props.autoStart) start()
})
onBeforeUnmount(stop)

defineExpose({ start, stop })
</script>

<template>
  <div :class="[ns.b(), ns.is('countdown')]">
    <div v-if="title || $slots.title" :class="ns.e('title')">
      <slot name="title">{{ title }}</slot>
    </div>

    <div :class="ns.e('value-row')">
      <span v-if="prefix || $slots.prefix" :class="ns.e('prefix')">
        <slot name="prefix">{{ prefix }}</slot>
      </span>

      <span :class="ns.e('value')" :style="valueStyles">{{ formatted }}</span>

      <span v-if="suffix || $slots.suffix" :class="ns.e('suffix')">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>
  </div>
</template>
