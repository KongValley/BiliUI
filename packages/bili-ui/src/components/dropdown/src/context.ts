import { inject, provide, type InjectionKey } from 'vue'

export interface DropdownContext {
  close: () => void
  select: (key: string) => void
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('bili-dropdown')

export function useDropdownContext(): DropdownContext | null {
  return inject(dropdownContextKey, null)
}

export function provideDropdownContext(context: DropdownContext): void {
  provide(dropdownContextKey, context)
}
