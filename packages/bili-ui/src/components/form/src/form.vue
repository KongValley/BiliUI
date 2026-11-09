<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { formProps } from './form'
import {
  formContextKey,
  type FormContext,
  type FormItemContext
} from './types'

defineOptions({ name: 'BiliForm' })

const props = defineProps(formProps)

const emit = defineEmits<{
  validate: [valid: boolean, invalidFields?: Record<string, string>]
}>()

const ns = useNamespace('form')

const fields: FormItemContext[] = []

const addField = (field: FormItemContext) => {
  if (!fields.includes(field)) fields.push(field)
}

const removeField = (field: FormItemContext) => {
  const index = fields.indexOf(field)
  if (index > -1) fields.splice(index, 1)
}

provide<FormContext>(formContextKey, {
  model: toRef(props, 'model'),
  rules: computed(() => props.rules),
  labelWidth: toRef(props, 'labelWidth'),
  labelPosition: toRef(props, 'labelPosition'),
  showMessage: toRef(props, 'showMessage'),
  addField,
  removeField
})

type ValidateCallback = (valid: boolean, invalidFields?: Record<string, string>) => void

const validate = async (callback?: ValidateCallback): Promise<boolean> => {
  const results = await Promise.all(
    fields.map(async field => ({ field, valid: await field.validate() }))
  )

  const invalidFields: Record<string, string> = {}
  results.forEach(({ field, valid }) => {
    if (!valid && field.prop) invalidFields[field.prop] = field.getMessage()
  })

  const valid = results.every(item => item.valid)
  callback?.(valid, valid ? undefined : invalidFields)
  emit('validate', valid, valid ? undefined : invalidFields)
  return valid
}

const validateField = async (
  propsToValidate: string | string[],
  callback?: (valid: boolean) => void
): Promise<boolean> => {
  const keys = Array.isArray(propsToValidate) ? propsToValidate : [propsToValidate]
  const targets = fields.filter(field => keys.includes(field.prop))
  if (!targets.length) {
    callback?.(true)
    return true
  }
  const results = await Promise.all(targets.map(field => field.validate()))
  const valid = results.every(Boolean)
  callback?.(valid)
  return valid
}

const resetFields = () => {
  fields.forEach(field => field.resetField())
}

const clearValidate = (propsToClear?: string | string[]) => {
  if (propsToClear === undefined) {
    fields.forEach(field => field.clearValidate())
    return
  }
  const keys = Array.isArray(propsToClear) ? propsToClear : [propsToClear]
  fields.filter(field => keys.includes(field.prop)).forEach(field => field.clearValidate())
}

defineExpose({ validate, validateField, resetFields, clearValidate })
</script>

<template>
  <form :class="ns.b()" @submit.prevent>
    <slot />
  </form>
</template>
