<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { inputNumberProps } from './input-number'

defineOptions({ name: 'BiliInputNumber' })

const props = defineProps(inputNumberProps)

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
  change: [value: number | undefined]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('input-number')

const inputRef = ref<HTMLInputElement | null>(null)
const draft = ref<string>('')
const focused = ref(false)

const decimals = computed(() => {
  if (props.precision !== undefined) return props.precision
  const step = String(props.step)
  const index = step.indexOf('.')
  return index === -1 ? 0 : step.length - index - 1
})

const clampValue = (value: number): number => {
  const bounded = Math.min(props.max, Math.max(props.min, value))
  const factor = Math.pow(10, decimals.value)
  return Math.round(bounded * factor) / factor
}

const displayValue = computed(() => {
  if (props.modelValue === undefined || Number.isNaN(props.modelValue)) return ''
  if (props.formatter) return props.formatter(props.modelValue)
  return String(props.modelValue)
})

// While focused the raw draft wins so the caret never jumps mid-typing.
const shown = computed(() => (focused.value ? draft.value : displayValue.value))

const canDecrease = computed(
  () => !props.disabled && props.modelValue !== undefined && props.modelValue > props.min
)
const canIncrease = computed(
  () => !props.disabled && (props.modelValue === undefined || props.modelValue < props.max)
)

const commit = (value: number | undefined) => {
  if (value === undefined || Number.isNaN(value)) {
    emit('update:modelValue', undefined)
    return
  }
  const next = clampValue(value)
  if (next !== props.modelValue) {
    emit('update:modelValue', next)
    emit('change', next)
  } else {
    draft.value = String(next)
  }
}

const stepBy = (direction: 1 | -1) => {
  if (props.disabled) return
  const base = props.modelValue ?? (direction === 1 ? props.min : props.max)
  if (!Number.isFinite(base)) return
  const next = base + props.step * direction
  commit(next)
  draft.value = String(clampValue(next))
}

const parseDraft = (raw: string): number | undefined => {
  if (raw.trim() === '') return undefined
  const parsed = props.parser ? props.parser(raw) : Number(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

const handleInput = (event: Event) => {
  draft.value = (event.target as HTMLInputElement).value
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  draft.value = displayValue.value
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  const parsed = parseDraft(draft.value)
  commit(parsed === undefined ? undefined : parsed)
  draft.value = displayValue.value
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    stepBy(1)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    stepBy(-1)
  } else if (event.key === 'Enter') {
    inputRef.value?.blur()
  }
}

watch(
  () => props.modelValue,
  () => {
    if (!focused.value) draft.value = displayValue.value
  },
  { immediate: true }
)
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(size),
      ns.is('disabled', disabled),
      ns.is('focused', focused)
    ]"
  >
    <input
      ref="inputRef"
      :class="ns.e('input')"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      :value="shown"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="{ textAlign: align }"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />

    <div v-if="controls" :class="ns.e('controls')">
      <button
        :class="ns.e('button')"
        type="button"
        tabindex="-1"
        aria-label="减少"
        :disabled="!canDecrease"
        @click="stepBy(-1)"
      >
        <BiliIcon name="chevron-up" :size="11" />
      </button>
      <button
        :class="ns.e('button')"
        type="button"
        tabindex="-1"
        aria-label="增加"
        :disabled="!canIncrease"
        @click="stepBy(1)"
      >
        <BiliIcon name="chevron-down" :size="11" />
      </button>
    </div>
  </div>
</template>
