import { inject, provide, type InjectionKey, type Ref } from 'vue'

export interface CollapseContext {
  isOpen: (name: string | number) => boolean
  toggle: (name: string | number) => void
  accordion: Ref<boolean>
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('bili-collapse')

export function useCollapseContext(): CollapseContext {
  const context = inject(collapseContextKey, null)
  if (!context) {
    throw new Error('[bili-ui] BiliCollapseItem must be used inside BiliCollapse')
  }
  return context
}

export function provideCollapseContext(context: CollapseContext): void {
  provide(collapseContextKey, context)
}
