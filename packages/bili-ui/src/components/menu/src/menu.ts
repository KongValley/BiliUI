import type { PropType } from 'vue'

export type MenuMode = 'horizontal' | 'vertical'
export type MenuTrigger = 'hover' | 'click'

export interface MenuItem {
  /** Unique key, emitted on select. */
  key: string
  label: string
  /** Icon name, see the Icon component. */
  icon?: string
  disabled?: boolean
  children?: MenuItem[]
}

export const menuProps = {
  mode: {
    type: String as PropType<MenuMode>,
    default: 'horizontal'
  },
  /** Data-driven items. Declare `<BiliMenuItem>` in the slot instead if you prefer. */
  items: {
    type: Array as PropType<MenuItem[]>,
    default: () => []
  },
  modelValue: {
    type: String,
    default: undefined
  },
  /** Sub menu keys opened initially (vertical mode). */
  defaultOpenedKeys: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  /** Collapse to icon-only rail (vertical mode only). */
  collapsed: Boolean,
  collapsedWidth: {
    type: [String, Number] as PropType<string | number>,
    default: 64
  },
  /** Horizontal: collapse items that overflow into a "more" dropdown. */
  overflow: {
    type: Boolean,
    default: true
  },
  /** How sub menus open. */
  trigger: {
    type: String as PropType<MenuTrigger>,
    default: 'hover'
  },
  ellipsisText: {
    type: String,
    default: '更多'
  },
  /** Extra class on every teleported menu popup, useful for per-instance theming. */
  popperClass: {
    type: String,
    default: ''
  }
} as const

export const menuItemProps = {
  itemKey: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: Boolean
} as const

export const subMenuProps = {
  subKey: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: Boolean
} as const
