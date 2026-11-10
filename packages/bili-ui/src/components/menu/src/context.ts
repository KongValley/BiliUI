import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { MenuMode, MenuTrigger } from './menu'

export interface MenuContext {
  mode: Ref<MenuMode>
  triggerValue: Ref<MenuTrigger>
  /** Icon-only rail: labels are hidden and sub menus become floating popups. */
  collapsed: Ref<boolean>
  selectedKey: Ref<string | undefined>
  /** Extra class applied to teleported submenu / overflow panels. */
  popperClass: Ref<string>
  isOpen: (key: string) => boolean
  toggleOpen: (key: string, open?: boolean) => void
  select: (key: string, label: string) => void
  /**
   * True inside a floating panel (horizontal popup, overflow dropdown, or
   * collapsed rail popup), where children must always stack vertically.
   */
  inPanel: boolean
  depth: number
}

export const menuContextKey: InjectionKey<MenuContext> = Symbol('bili-menu')

export function useMenuContext(): MenuContext {
  const context = inject(menuContextKey, null)
  if (!context) {
    throw new Error('[bili-ui] BiliMenuItem / BiliSubMenu must be used inside BiliMenu')
  }
  return context
}

/**
 * Nested menu content (popups, inline sub lists) must re-provide the context
 * with `inPanel` flipped so grandchildren stack vertically.
 */
export function providePanelContext(parent: MenuContext): MenuContext {
  const panel: MenuContext = {
    ...parent,
    inPanel: true,
    depth: parent.depth + 1
  }
  provide(menuContextKey, panel)
  return panel
}

/** Reads the parent context; used by menu.vue without the throw-on-missing guard. */
export function useOptionalMenuContext(): MenuContext | null {
  return inject(menuContextKey, null)
}
