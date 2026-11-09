<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFormItem } from '../../form/src/types'
import { checkboxGroupContextKey } from './context'

defineOptions({ name: 'BiliCheckboxGroup' })

const props = withDefaults(
  defineProps<{
    modelValue?: Array<string | number | boolean>
    disabled?: boolean
    min?: number
    max?: number
  }>(),
  {
    modelValue: () => [],
    disabled: false,
    min: undefined,
    max: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number | boolean>]
  change: [value: Array<string | number | boolean>]
}>()

const ns = useNamespace('checkbox-group')
const formItem = useFormItem()

const toggle = (value: any, checked: boolean) => {
  const next = [...props.modelValue]
  const index = next.indexOf(value)

  if (checked && index === -1) {
    if (props.max !== undefined && next.length >= props.max) return
    next.push(value)
  } else if (!checked && index > -1) {
    if (props.min !== undefined && next.length <= props.min) return
    next.splice(index, 1)
  } else {
    return
  }

  emit('update:modelValue', next)
  emit('change', next)
  formItem?.validate('change')
}

provide(checkboxGroupContextKey, {
  modelValue: computed(() => props.modelValue),
  disabled: toRef(props, 'disabled'),
  toggle
})
</script>

<template>
  <div :class="ns.b()" role="group">
    <slot />
  </div>
</template>
