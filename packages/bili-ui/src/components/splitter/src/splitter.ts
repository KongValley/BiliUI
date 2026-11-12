import type { InjectionKey, PropType, Ref } from 'vue'

export type SplitterDirection = 'horizontal' | 'vertical'
export type SplitterSize = number | string

export const splitterProps = {
  /** Legacy two-pane mode: size of the start pane, as a percentage. */
  modelValue: {
    type: Number,
    default: 50
  },
  direction: {
    type: String as PropType<SplitterDirection>,
    default: 'horizontal'
  },
  /** Legacy two-pane mode: minimum start-pane percentage. */
  min: {
    type: Number,
    default: 10
  },
  /** Legacy two-pane mode: maximum start-pane percentage. */
  max: {
    type: Number,
    default: 90
  },
  /** Keyboard resize step, in percentage points. */
  step: {
    type: Number,
    default: 5
  },
  dividerSize: {
    type: Number,
    default: 6
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: 240
  },
  disabled: Boolean,
  /** Controlled panel sizes for multi-panel mode, as percentages. */
  sizes: {
    type: Array as PropType<SplitterSize[]>,
    default: undefined
  }
} as const

export const splitterPanelProps = {
  /** Initial panel size. Numbers are percentages; `px` / `%` strings are accepted. */
  size: {
    type: [Number, String] as PropType<SplitterSize>,
    default: undefined
  },
  min: {
    type: [Number, String] as PropType<SplitterSize>,
    default: 0
  },
  max: {
    type: [Number, String] as PropType<SplitterSize>,
    default: 100
  },
  collapsible: Boolean,
  resizable: {
    type: Boolean,
    default: true
  }
} as const

export interface SplitterPanelEntry {
  size?: SplitterSize
  min?: SplitterSize
  max?: SplitterSize
  collapsible: boolean
  resizable: boolean
}

export interface SplitterContext {
  readonly direction: SplitterDirection
  readonly dividerSize: number
  readonly disabled: boolean
  readonly panels: SplitterPanelEntry[]
  readonly draggingIndex: Ref<number | null>
  indexOf: (entry: SplitterPanelEntry) => number
  sizeOf: (entry: SplitterPanelEntry) => number | undefined
  sizeAt: (index: number) => number | undefined
  boundsAt: (index: number) => { min: number; max: number }
  registerPanel: (entry: SplitterPanelEntry) => void
  unregisterPanel: (entry: SplitterPanelEntry) => void
  setPanelSize: (entry: SplitterPanelEntry, size: SplitterSize) => void
  startDrag: (event: PointerEvent, entry: SplitterPanelEntry) => void
  handleDividerKeydown: (event: KeyboardEvent, entry: SplitterPanelEntry) => void
  toggleCollapse: (entry: SplitterPanelEntry) => void
}

export const splitterContextKey: InjectionKey<SplitterContext> = Symbol('bili-splitter')
