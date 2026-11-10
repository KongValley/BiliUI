import type { PropType } from 'vue'

export type DropdownTrigger = 'hover' | 'click' | 'contextmenu'
export type DropdownPlacement =
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'left'
  | 'right'

export interface DropdownItem {
  key: string
  label: string
  icon?: string
  disabled?: boolean
  divided?: boolean
  /** Right-aligned hint such as a shortcut. */
  shortcut?: string
}

export const dropdownProps = {
  trigger: {
    type: String as PropType<DropdownTrigger>,
    default: 'hover'
  },
  placement: {
    type: String as PropType<DropdownPlacement>,
    default: 'bottom-start'
  },
  /** Data-driven items. Declare `<BiliDropdownItem>` in the slot instead if needed. */
  items: {
    type: Array as PropType<DropdownItem[]>,
    default: () => []
  },
  disabled: Boolean,
  /** Show a caret next to the trigger content. */
  arrow: {
    type: Boolean,
    default: true
  },
  /** Delay before opening on hover, in ms. */
  showTimeout: {
    type: Number,
    default: 80
  },
  /** Delay before closing when the pointer leaves, in ms. */
  hideTimeout: {
    type: Number,
    default: 120
  }
} as const

export const dropdownItemProps = {
  itemKey: {
    type: String,
    required: true
  },
  disabled: Boolean,
  divided: Boolean,
  shortcut: {
    type: String,
    default: ''
  }
} as const

export type DropdownProps = typeof dropdownProps
export type DropdownItemProps = typeof dropdownItemProps
