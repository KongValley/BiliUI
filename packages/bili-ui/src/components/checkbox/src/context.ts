import type { InjectionKey, Ref } from 'vue'

export interface CheckboxGroupContext {
  modelValue: Ref<Array<string | number | boolean>>
  disabled: Ref<boolean>
  toggle: (value: any, checked: boolean) => void
}

export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> =
  Symbol('bili-checkbox-group')
