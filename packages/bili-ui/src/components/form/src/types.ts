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
  /**
   * Other fields this rule reads. When any of them changes, this field is
   * validated again. Use full model paths, e.g. `'user.password'`.
   */
  dependencies?: string[]
  validator?: (
    value: any,
    rule: FormItemRule,
    model: Record<string, any>
  ) => boolean | string | Promise<boolean | string>
}

export type FormRules = Record<string, FormItemRule | FormItemRule[]>

export interface FormItemContext {
  /** Full model path, including any `FormList` prefix. */
  prop: string
  validate: (trigger?: FormValidationTrigger, propagate?: boolean) => Promise<boolean>
  resetField: () => void
  clearValidate: () => void
  getMessage: () => string
  /** Fields this item depends on, from `rule.dependencies`. */
  getDependencies: () => string[]
  /** Root element, used to scroll the first invalid field into view. */
  getElement: () => HTMLElement | undefined
}

export interface FormContext {
  model: Ref<Record<string, any>>
  rules: ComputedRef<FormRules | undefined>
  labelWidth: Ref<string | number>
  labelPosition: Ref<'left' | 'right' | 'top'>
  showMessage: Ref<boolean>
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
  /** Re-validate fields that declare `prop` in their rule dependencies. */
  notifyFieldChange: (prop: string) => void
}

/** Prefix injected by `FormList` so nested fields build `list.0.field` paths. */
export interface FormListContext {
  prefix: Ref<string>
}

export const formContextKey: InjectionKey<FormContext> = Symbol('bili-form')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('bili-form-item')
export const formListContextKey: InjectionKey<FormListContext> = Symbol('bili-form-list')

export const useFormContext = (): FormContext | null => inject(formContextKey, null)
export const useFormItem = (): FormItemContext | null => inject(formItemContextKey, null)
export const useFormListContext = (): FormListContext | null =>
  inject(formListContextKey, null)
