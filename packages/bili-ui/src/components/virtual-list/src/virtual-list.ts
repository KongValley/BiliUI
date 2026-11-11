import type { PropType } from 'vue'

export type VirtualListKey = string | number
export type VirtualListRowKey = string | ((item: any, index: number) => VirtualListKey)

export const virtualListProps = {
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  /** Fixed row height in px. */
  itemHeight: {
    type: Number,
    default: 40
  },
  /** Viewport height in px. */
  height: {
    type: Number,
    default: 300
  },
  /** Extra rows rendered above and below the viewport. */
  buffer: {
    type: Number,
    default: 4
  },
  rowKey: {
    type: [String, Function] as PropType<VirtualListRowKey>,
    default: undefined
  }
} as const
