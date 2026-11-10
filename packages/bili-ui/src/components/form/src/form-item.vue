<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import { addUnit } from '../../../utils/dom'
import { cloneDeep, getProp, setProp } from '../../../utils/object'
import { formItemProps } from './form-item'
import {
  formItemContextKey,
  useFormContext,
  useFormListContext,
  type FormItemContext,
  type FormItemRule
} from './types'
import { validateRule } from './validate'

defineOptions({ name: 'BiliFormItem' })

const props = defineProps(formItemProps)

const emit = defineEmits<{
  validate: [valid: boolean, message?: string]
}>()

const ns = useNamespace('form-item')
const form = useFormContext()
const list = useFormListContext()

const validateState = ref<'success' | 'error' | 'validating' | ''>('')
const validateMessage = ref('')
const rootRef = ref<HTMLElement | null>(null)
let initialValue: any = undefined

/** Field path prefixed by any enclosing `FormList` item. */
const fieldProp = computed(() => {
  if (!props.prop) return ''
  const prefix = list?.prefix.value
  return prefix ? `${prefix}.${props.prop}` : props.prop
})

const labelPosition = computed(() => form?.labelPosition.value ?? 'right')
const fieldValue = computed(() =>
  form && fieldProp.value ? getProp(form.model.value, fieldProp.value) : undefined
)

const mergedRules = computed<FormItemRule[]>(() => {
  const own = props.rules ? (Array.isArray(props.rules) ? props.rules : [props.rules]) : []
  const formRules = fieldProp.value
    ? (form?.rules.value?.[fieldProp.value] ?? form?.rules.value?.[props.prop])
    : undefined
  const fromForm = formRules ? (Array.isArray(formRules) ? formRules : [formRules]) : []
  const result = [...own, ...fromForm]
  if (props.required && !result.some(rule => rule.required)) {
    result.unshift({ required: true })
  }
  return result
})

const isRequired = computed(
  () => props.required === true || mergedRules.value.some(rule => rule.required)
)

const showMessage = computed(
  () => props.showMessage ?? form?.showMessage.value ?? true
)

const hasError = computed(() => validateState.value === 'error' || !!props.error)
const message = computed(() => props.error || validateMessage.value)

const labelStyle = computed(() => {
  if (labelPosition.value === 'top') return {}
  const width = props.labelWidth ?? form?.labelWidth.value ?? '96px'
  return { width: addUnit(width) }
})

const getTriggerRules = (trigger?: 'blur' | 'change'): FormItemRule[] => {
  if (!trigger) return mergedRules.value
  return mergedRules.value.filter(rule => {
    const ruleTrigger = rule.trigger ?? ['blur', 'change']
    return Array.isArray(ruleTrigger) ? ruleTrigger.includes(trigger) : ruleTrigger === trigger
  })
}

const validate = async (trigger?: 'blur' | 'change', propagate = true): Promise<boolean> => {
  if (!fieldProp.value || !form) return true

  // Notify dependants even when this field has no rules of its own.
  if (propagate && trigger === 'change') form.notifyFieldChange(fieldProp.value)

  const rules = getTriggerRules(trigger)
  if (!rules.length) return true

  validateState.value = 'validating'
  try {
    for (const rule of rules) {
      await validateRule(rule, fieldValue.value, form.model.value)
    }
    validateState.value = 'success'
    validateMessage.value = ''
    emit('validate', true)
    return true
  } catch (error: any) {
    validateState.value = 'error'
    validateMessage.value = error?.message || '校验未通过'
    emit('validate', false, validateMessage.value)
    return false
  }
}

const clearValidate = () => {
  validateState.value = ''
  validateMessage.value = ''
}

const resetField = () => {
  if (!fieldProp.value || !form) return
  setProp(form.model.value, fieldProp.value, cloneDeep(initialValue))
  clearValidate()
}

const getDependencies = (): string[] => {
  const prefix = list?.prefix.value
  const dependencies = mergedRules.value
    .flatMap(rule => rule.dependencies ?? [])
    // Inside a FormList a bare dependency name refers to a sibling field.
    .map(dependency => {
      if (!prefix || dependency === prefix || dependency.startsWith(`${prefix}.`)) {
        return dependency
      }
      return `${prefix}.${dependency}`
    })
  return [...new Set(dependencies)]
}

const context: FormItemContext = {
  get prop() {
    return fieldProp.value
  },
  validate,
  resetField,
  clearValidate,
  getMessage: () => validateMessage.value,
  getDependencies,
  getElement: () => rootRef.value ?? undefined
}

provide(formItemContextKey, context)

onMounted(() => {
  initialValue = cloneDeep(fieldValue.value)
  if (fieldProp.value) form?.addField(context)
})

onBeforeUnmount(() => {
  form?.removeField(context)
})

defineExpose({ validate, resetField, clearValidate, validateMessage })
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      ns.b(),
      ns.m(labelPosition),
      ns.is('error', hasError),
      ns.is('validating', validateState === 'validating')
    ]"
  >
    <label
      v-if="label || $slots.label"
      :class="ns.e('label')"
      :style="labelStyle"
    >
      <span v-if="isRequired" :class="ns.e('asterisk')" aria-hidden="true">*</span>
      <slot name="label">{{ label }}</slot>
    </label>

    <div :class="ns.e('content')">
      <div :class="ns.e('control')">
        <slot />
      </div>
      <Transition name="bili-form-item-fade">
        <div
          v-if="showMessage && hasError && message"
          :class="ns.e('error')"
          role="alert"
        >
          {{ message }}
        </div>
      </Transition>
    </div>
  </div>
</template>
