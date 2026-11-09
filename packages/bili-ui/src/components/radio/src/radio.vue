<script setup lang="ts">
import { computed, inject } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFormItem } from '../../form/src/types'
import { radioGroupContextKey } from './context'

defineOptions({ name: 'BiliRadio' })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean
    value?: string | number | boolean
    label?: string | number
    disabled?: boolean
    name?: string
  }>(),
  {
    modelValue: undefined,
    value: undefined,
    label: undefined,
    disabled: false,
    name: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
}>()

const ns = useNamespace('radio')
const group = inject(radioGroupContextKey, null)
const formItem = useFormItem()

const radioValue = computed(() => (props.value !== undefined ? props.value : props.label))
const isChecked = computed(() =>
  group ? group.modelValue.value === radioValue.value : props.modelValue === radioValue.value
)
const isDisabled = computed(() => props.disabled || !!group?.disabled.value)

const handleChange = () => {
  if (isDisabled.value || isChecked.value) return
  if (group) {
    group.select(radioValue.value)
    return
  }
  emit('update:modelValue', radioValue.value)
  emit('change', radioValue.value)
  formItem?.validate('change')
}
</script>

<template>
  <label
    :class="[ns.b(), ns.is('checked', isChecked), ns.is('disabled', isDisabled)]"
  >
    <span :class="ns.e('input')">
      <input
        :class="ns.e('original')"
        type="radio"
        :checked="isChecked"
        :disabled="isDisabled"
        :name="group?.name.value ?? name"
        @change="handleChange"
      />
      <span :class="ns.e('inner')" />
    </span>
    <span v-if="$slots.default || label !== undefined" :class="ns.e('label')">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
