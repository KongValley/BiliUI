import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupContext {
  modelValue: Ref<any>
  disabled: Ref<boolean>
  name: Ref<string | undefined>
  select: (value: any) => void
}

export const radioGroupContextKey: InjectionKey<RadioGroupContext> =
  Symbol('bili-radio-group')
