import { inject, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export type FormValidationTrigger = 'blur' | 'change'

export interface FormItemRule {
  required?: boolean
  message?: string
  trigger?: FormValidationTrigger | FormValidationTrigger[]
  type?: 'string' | 'number' | 'email' | 'url' | 'array'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: (
    value: any,
    rule: FormItemRule,
    model: Record<string, any>
  ) => boolean | string | Promise<boolean | string>
}

export type FormRules = Record<string, FormItemRule | FormItemRule[]>

export interface FormItemContext {
  prop: string
  validate: (trigger?: FormValidationTrigger) => Promise<boolean>
  resetField: () => void
  clearValidate: () => void
  getMessage: () => string
}

export interface FormContext {
  model: Ref<Record<string, any>>
  rules: ComputedRef<FormRules | undefined>
  labelWidth: Ref<string | number>
  labelPosition: Ref<'left' | 'right' | 'top'>
  showMessage: Ref<boolean>
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('bili-form')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('bili-form-item')

export const useFormContext = (): FormContext | null => inject(formContextKey, null)
export const useFormItem = (): FormItemContext | null => inject(formItemContextKey, null)
