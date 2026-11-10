<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useConfig } from '../../../hooks/use-config'
import BiliIcon from '../../icon/src/icon.vue'
import { useFormItem } from '../../form/src/types'
import { inputProps } from './input'

defineOptions({ name: 'BiliInput' })

const props = defineProps(inputProps)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  keydown: [event: KeyboardEvent]
}>()

const ns = useNamespace('input')
const config = useConfig()
const mergedSize = computed(() => props.size ?? config.value.size)
const formItem = useFormItem()
const slots = defineSlots<{
  prefix?: () => any
  suffix?: () => any
  prepend?: () => any
  append?: () => any
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const passwordVisible = ref(false)
const focused = ref(false)

const displayValue = computed(() => props.modelValue ?? '')
const valueLength = computed(() => String(props.modelValue ?? '').length)
const inputType = computed(() =>
  props.type === 'password' && passwordVisible.value ? 'text' : props.type
)
const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    valueLength.value > 0
)
const showPasswordToggle = computed(() => props.type === 'password' && props.showPassword)
const hasAddon = computed(() => !!(slots.prepend || slots.append))

const currentValue = (event: Event): string =>
  (event.target as HTMLInputElement | HTMLTextAreaElement).value

const handleInput = (event: Event) => {
  const value = currentValue(event)
  emit('update:modelValue', value)
  emit('input', value)
  formItem?.validate('change')
}

const handleChange = (event: Event) => {
  emit('change', currentValue(event))
  formItem?.validate('change')
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
  formItem?.validate('blur')
}

const focus = () => {
  ;(inputRef.value ?? textareaRef.value)?.focus()
}

const blur = () => {
  ;(inputRef.value ?? textareaRef.value)?.blur()
}

const select = () => {
  ;(inputRef.value ?? textareaRef.value)?.select()
}

const clear = () => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('change', '')
  emit('clear')
  formItem?.validate('change')
  nextTick(focus)
}

const togglePassword = () => {
  passwordVisible.value = !passwordVisible.value
  nextTick(focus)
}

defineExpose({ inputRef, textareaRef, focus, blur, select })
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(mergedSize),
      ns.is('group', hasAddon),
      ns.is('textarea', type === 'textarea'),
      ns.is('disabled', disabled),
      ns.is('readonly', readonly),
      ns.is('focus', focused)
    ]"
  >
    <span v-if="$slots.prepend" :class="ns.e('prepend')">
      <slot name="prepend" />
    </span>

    <div :class="ns.e('wrap')">
      <span v-if="$slots.prefix" :class="ns.e('prefix')">
        <slot name="prefix" />
      </span>

      <textarea
        v-if="type === 'textarea'"
        ref="textareaRef"
        :class="ns.e('inner')"
        :value="displayValue"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="emit('keydown', $event)"
      />

      <input
        v-else
        ref="inputRef"
        :class="ns.e('inner')"
        :type="inputType"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="emit('keydown', $event)"
      />

      <span
        v-if="
          $slots.suffix ||
          showClear ||
          showPasswordToggle ||
          showCount
        "
        :class="ns.e('suffix')"
      >
        <button
          v-if="showClear"
          :class="ns.e('action')"
          type="button"
          tabindex="-1"
          aria-label="清空"
          @mousedown.prevent
          @click="clear"
        >
          <BiliIcon name="close-circle" />
        </button>

        <button
          v-if="showPasswordToggle"
          :class="ns.e('action')"
          type="button"
          tabindex="-1"
          :aria-label="passwordVisible ? '隐藏密码' : '显示密码'"
          @mousedown.prevent
          @click="togglePassword"
        >
          <BiliIcon :name="passwordVisible ? 'eye' : 'eye-off'" />
        </button>

        <slot name="suffix" />

        <span v-if="showCount" :class="ns.e('count')">
          {{ valueLength }}<template v-if="maxlength">/{{ maxlength }}</template>
        </span>
      </span>
    </div>

    <span v-if="$slots.append" :class="ns.e('append')">
      <slot name="append" />
    </span>
  </div>
</template>
