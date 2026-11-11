<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig } from '../../../hooks/use-config'
import { useFormItem } from '../../form/src/types'
import { inputOtpProps } from './otp'

defineOptions({ name: 'BiliInputOtp' })

const props = defineProps(inputOtpProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  complete: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const ns = useNamespace('input-otp')
const config = useConfig()
const formItem = useFormItem()
const mergedSize = computed(() => props.size ?? config.value.size)

const inputRefs = ref<HTMLInputElement[]>([])
const focusedIndex = ref(-1)

const cells = computed(() => {
  const chars = Array.from(props.modelValue ?? '')
  return Array.from({ length: props.length }, (_, index) => chars[index] ?? '')
})

const setRef = (el: unknown, index: number) => {
  if (el) inputRefs.value[index] = el as HTMLInputElement
}

const focusCell = (index: number) => {
  const target = Math.max(0, Math.min(props.length - 1, index))
  void nextTick(() => {
    inputRefs.value[target]?.focus()
    inputRefs.value[target]?.select()
  })
}

const commit = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  formItem?.validate('change')
  if (value.length >= props.length) emit('complete', value)
}

const handleInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const char = input.value.slice(-1)
  input.value = ''

  if (!char) return

  const chars = cells.value.slice()
  chars[index] = char
  commit(chars.join('').slice(0, props.length))
  focusCell(index + 1)
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace') {
    event.preventDefault()
    const chars = cells.value.slice()
    if (chars[index]) {
      chars[index] = ''
      commit(chars.join(''))
      return
    }
    if (index > 0) {
      chars[index - 1] = ''
      commit(chars.join(''))
      focusCell(index - 1)
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusCell(index - 1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusCell(index + 1)
  }
}

const handlePaste = (event: ClipboardEvent, index: number) => {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') ?? ''
  if (!text) return

  const chars = cells.value.slice()
  const pasted = Array.from(text.replace(/\s/g, ''))
  pasted.forEach((char, offset) => {
    const target = index + offset
    if (target < props.length) chars[target] = char
  })

  const value = chars.join('').slice(0, props.length)
  commit(value)
  focusCell(Math.min(index + pasted.length, props.length - 1))
}

const handleFocus = (event: FocusEvent, index: number) => {
  focusedIndex.value = index
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focusedIndex.value = -1
  emit('blur', event)
  formItem?.validate('blur')
}

defineExpose({ focusCell, inputRefs })
</script>

<template>
  <div
    :class="[ns.b(), ns.m(mergedSize), ns.is('focused', focusedIndex > -1)]"
    role="group"
  >
    <template v-for="index in length" :key="index">
      <input
        :ref="el => setRef(el, index - 1)"
        :class="[ns.e('cell'), ns.is('filled', !!cells[index - 1])]"
        :type="mask ? 'password' : 'text'"
        :inputmode="type === 'number' ? 'numeric' : 'text'"
        :maxlength="1"
        :value="cells[index - 1]"
        :disabled="disabled"
        :aria-label="`${index}`"
        @input="handleInput($event, index - 1)"
        @keydown="handleKeydown($event, index - 1)"
        @paste="handlePaste($event, index - 1)"
        @focus="handleFocus($event, index - 1)"
        @blur="handleBlur"
      />

      <span
        v-if="separator !== '' && index < length"
        :class="ns.e('separator')"
        aria-hidden="true"
      >
        {{ separator }}
      </span>
    </template>
  </div>
</template>
