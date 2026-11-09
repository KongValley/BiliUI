import type { InjectionKey } from 'vue'

export interface LayoutContext {
  /** Lets the parent layout know it should switch to the aside-aware layout. */
  registerAside: () => void
}

export const layoutContextKey: InjectionKey<LayoutContext> = Symbol('bili-layout')
