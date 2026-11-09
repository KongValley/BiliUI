<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import BiliIcon from '../../icon/src/icon.vue'
import { useFormItem } from '../../form/src/types'
import { checkboxGroupContextKey } from './context'

defineOptions({ name: 'BiliCheckbox' })

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    value?: string | number | boolean
    label?: string | number
    disabled?: boolean
    indeterminate?: boolean
    name?: string
  }>(),
  {
    modelValue: false,
    value: undefined,
    label: undefined,
    disabled: false,
    indeterminate: false,
    name: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const ns = useNamespace('checkbox')
const group = inject(checkboxGroupContextKey, null)
const formItem = useFormItem()
const inputRef = ref<HTMLInputElement | null>(null)

const checkboxValue = computed(() => (props.value !== undefined ? props.value : props.label))

const isChecked = computed(() =>
  group ? group.modelValue.value.includes(checkboxValue.value as any) : props.modelValue
)

const isDisabled = computed(() => props.disabled || !!group?.disabled.value)

const handleChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  if (group) {
    group.toggle(checkboxValue.value, checked)
    return
  }
  emit('update:modelValue', checked)
  emit('change', checked)
  formItem?.validate('change')
}

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
})
</script>

<template>
  <label
    :class="[
      ns.b(),
      ns.is('checked', isChecked),
      ns.is('disabled', isDisabled),
      ns.is('indeterminate', indeterminate)
    ]"
  >
    <span :class="ns.e('input')">
      <input
        ref="inputRef"
        :class="ns.e('original')"
        type="checkbox"
        :checked="isChecked"
        :disabled="isDisabled"
        :name="name"
        @change="handleChange"
      />
      <span :class="ns.e('inner')">
        <BiliIcon v-if="indeterminate" name="minus" />
        <BiliIcon v-else-if="isChecked" name="check" />
      </span>
    </span>
    <span v-if="$slots.default || label !== undefined" :class="ns.e('label')">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
