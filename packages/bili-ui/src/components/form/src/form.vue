<script setup lang="ts">
import { computed, nextTick, provide, toRef } from 'vue'
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
  removeField,
  notifyFieldChange
})

type ValidateCallback = (valid: boolean, invalidFields?: Record<string, string>) => void

const runValidation = async (targets: FormItemContext[]) => {
  const results = await Promise.all(
    targets.map(async field => ({ field, valid: await field.validate() }))
  )

  const invalidFields: Record<string, string> = {}
  results.forEach(({ field, valid }) => {
    if (!valid && field.prop) invalidFields[field.prop] = field.getMessage()
  })

  return {
    valid: results.every(item => item.valid),
    invalidFields
  }
}

const scrollToFirstError = async () => {
  await nextTick()
  const field = fields.find(item => !!item.getMessage())
  const element = field?.getElement()
  // jsdom and older browsers may not implement scrollIntoView.
  if (element && typeof element.scrollIntoView === 'function') {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const validate = async (callback?: ValidateCallback): Promise<boolean> => {
  const { valid, invalidFields } = await runValidation(fields)
  callback?.(valid, valid ? undefined : invalidFields)
  emit('validate', valid, valid ? undefined : invalidFields)
  if (!valid && props.scrollToError) void scrollToFirstError()
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
  const { valid } = await runValidation(targets)
  callback?.(valid)
  return valid
}

/**
 * Validate a subset of fields (or all fields when omitted), reporting the
 * invalid field messages to the callback.
 */
const validateFields = async (
  propsToValidate?: string | string[],
  callback?: ValidateCallback
): Promise<boolean> => {
  if (propsToValidate === undefined) return validate(callback)

  const keys = Array.isArray(propsToValidate) ? propsToValidate : [propsToValidate]
  const targets = fields.filter(field => keys.includes(field.prop))
  if (!targets.length) {
    callback?.(true)
    return true
  }

  const { valid, invalidFields } = await runValidation(targets)
  callback?.(valid, valid ? undefined : invalidFields)
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

function notifyFieldChange(prop: string) {
  fields.forEach(field => {
    if (field.prop === prop) return
    if (field.getDependencies().includes(prop)) {
      void field.validate('change', false)
    }
  })
}

defineExpose({ validate, validateField, validateFields, resetFields, clearValidate, scrollToFirstError })
</script>

<template>
  <form :class="ns.b()" @submit.prevent>
    <slot />
  </form>
</template>
