import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

export interface BreadcrumbItemState {
  key: symbol
  to?: string | Record<string, unknown>
  href?: string
  replace: boolean
}

export interface BreadcrumbContext {
  separator: Ref<string>
  /** 0 disables collapsing. */
  maxItems: Ref<number>
  items: Ref<BreadcrumbItemState[]>
  register: (item: BreadcrumbItemState) => void
  unregister: (key: symbol) => void
  indexOf: (key: symbol) => number
}

export const breadcrumbContextKey: InjectionKey<BreadcrumbContext> = Symbol('bili-breadcrumb')

export function useBreadcrumbContext(): BreadcrumbContext {
  const context = inject(breadcrumbContextKey, null)
  if (!context) {
    throw new Error('[bili-ui] BiliBreadcrumbItem must be used inside BiliBreadcrumb')
  }
  return context
}

export function createBreadcrumbContext(
  separator: Ref<string>,
  maxItems: Ref<number>
): BreadcrumbContext {
  const items = ref<BreadcrumbItemState[]>([])

  const register = (item: BreadcrumbItemState) => {
    if (items.value.some(entry => entry.key === item.key)) return
    items.value.push(item)
  }

  const unregister = (key: symbol) => {
    const index = items.value.findIndex(item => item.key === key)
    if (index > -1) items.value.splice(index, 1)
  }

  const indexOf = (key: symbol): number => items.value.findIndex(item => item.key === key)

  return { separator, maxItems, items, register, unregister, indexOf }
}

export function provideBreadcrumbContext(context: BreadcrumbContext): void {
  provide(breadcrumbContextKey, context)
}
