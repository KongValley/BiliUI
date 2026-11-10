import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'
import type { TabsDirection, TabsType } from './tabs'

export interface TabPaneState {
  name: string | number
  label: string
  icon: string
  disabled: boolean
  closable: boolean
  el: HTMLElement | null
}

export interface TabsContext {
  /** Unique DOM id used to wire tab / panel ARIA relationships. */
  id: Ref<string>
  activeName: Ref<string | number | undefined>
  type: Ref<TabsType>
  direction: Ref<TabsDirection>
  lazy: Ref<boolean>
  closable: Ref<boolean>
  register: (pane: TabPaneState) => void
  unregister: (name: string | number) => void
  select: (name: string | number) => void
  requestClose: (name: string | number) => void
  /** Panels already visited, used by `lazy`. */
  visited: Ref<Set<string | number>>
  panes: Ref<TabPaneState[]>
}

export const tabsContextKey: InjectionKey<TabsContext> = Symbol('bili-tabs')

export function useTabsContext(): TabsContext {
  const context = inject(tabsContextKey, null)
  if (!context) {
    throw new Error('[bili-ui] BiliTabPane must be used inside BiliTabs')
  }
  return context
}

export function provideTabsContext(context: TabsContext): void {
  provide(tabsContextKey, context)
}

export function createTabsState(): {
  panes: Ref<TabPaneState[]>
  visited: Ref<Set<string | number>>
} {
  return {
    panes: ref<TabPaneState[]>([]),
    visited: ref<Set<string | number>>(new Set())
  }
}
