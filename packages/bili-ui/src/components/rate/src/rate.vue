<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { rateProps } from './rate'

defineOptions({ name: 'BiliRate' })

const props = defineProps(rateProps)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const ns = useNamespace('rate')
const hoverValue = ref<number | null>(null)

const isReadonly = computed(() => props.disabled || props.readonly)
const stars = computed(() =>
  Array.from({ length: Math.max(0, props.count) }, (_, index) => index + 1)
)
const displayValue = computed(() => hoverValue.value ?? props.modelValue)
const step = computed(() => (props.allowHalf ? 0.5 : 1))

const fillPercent = (star: number): number => {
  const value = displayValue.value
  if (value >= star) return 100
  if (value > star - 1) return Math.round((value - (star - 1)) * 100)
  return 0
}

const displayText = computed(() => {
  if (!props.showText) return ''
  const value = displayValue.value
  if (value <= 0) return ''
  const index = Math.ceil(value) - 1
  return props.texts[index] ?? String(value)
})

const clamp = (value: number): number => {
  const bounded = Math.min(props.count, Math.max(0, value))
  return props.allowHalf ? Math.round(bounded * 2) / 2 : Math.round(bounded)
}

const commit = (value: number) => {
  if (isReadonly.value) return
  const next = clamp(value)
  emit('update:modelValue', next)
  emit('change', next)
}

const valueFromPointer = (event: MouseEvent, star: number): number => {
  if (!props.allowHalf) return star
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const half = event.clientX - rect.left < rect.width / 2
  return star - (half ? 0.5 : 0)
}

const handleClick = (event: MouseEvent, star: number) => {
  if (isReadonly.value) return
  const value = valueFromPointer(event, star)
  if (props.allowClear && value === props.modelValue) {
    commit(0)
    return
  }
  commit(value)
}

const handleMouseMove = (event: MouseEvent, star: number) => {
  if (isReadonly.value) return
  hoverValue.value = valueFromPointer(event, star)
}

const handleMouseLeave = () => {
  hoverValue.value = null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (isReadonly.value) return
  let next: number | null = null

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = props.modelValue + step.value
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      next = props.modelValue - step.value
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = props.count
      break
  }

  if (next === null) return
  event.preventDefault()
  commit(next)
}
</script>

<template>
  <div
    :class="[ns.b(), ns.m(size), ns.is('disabled', disabled), ns.is('readonly', readonly)]"
    role="slider"
    :aria-valuemin="0"
    :aria-valuemax="count"
    :aria-valuenow="modelValue"
    :aria-valuetext="showText ? displayText || String(modelValue) : undefined"
    :aria-disabled="isReadonly || undefined"
    :tabindex="isReadonly ? -1 : 0"
    @mouseleave="handleMouseLeave"
    @keydown="handleKeydown"
  >
    <span
      v-for="star in stars"
      :key="star"
      :class="[
        ns.e('item'),
        ns.is('active', fillPercent(star) > 0),
        ns.is('half', fillPercent(star) === 50)
      ]"
      @mousemove="handleMouseMove($event, star)"
      @click="handleClick($event, star)"
    >
      <BiliIcon
        :class="ns.e('icon-void')"
        :name="icon"
        :style="voidColor ? { color: voidColor } : undefined"
      />
      <span :class="ns.e('fill')" :style="{ width: `${fillPercent(star)}%` }">
        <BiliIcon
          :class="ns.e('icon')"
          :name="icon"
          :style="color ? { color } : undefined"
        />
      </span>
    </span>

    <span v-if="showText" :class="ns.e('text')">{{ displayText }}</span>
  </div>
</template>
