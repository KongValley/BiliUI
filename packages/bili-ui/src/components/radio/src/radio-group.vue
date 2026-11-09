<script setup lang="ts">
import { provide, toRef } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { useFormItem } from '../../form/src/types'
import { radioGroupContextKey } from './context'

defineOptions({ name: 'BiliRadioGroup' })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean
    disabled?: boolean
    name?: string
  }>(),
  {
    modelValue: undefined,
    disabled: false,
    name: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
}>()

const ns = useNamespace('radio-group')
const formItem = useFormItem()

const select = (value: any) => {
  emit('update:modelValue', value)
  emit('change', value)
  formItem?.validate('change')
}

provide(radioGroupContextKey, {
  modelValue: toRef(props, 'modelValue'),
  disabled: toRef(props, 'disabled'),
  name: toRef(props, 'name'),
  select
})
</script>

<template>
  <div :class="ns.b()" role="radiogroup">
    <slot />
  </div>
</template>
