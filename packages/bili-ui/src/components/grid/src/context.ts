import { computed, provide, type CSSProperties, type InjectionKey } from 'vue'
import { useNamespace } from '../../../hooks/use-namespace'
import type { RowAlign, RowJustify } from './grid'

export interface RowContext {
  /** Current gutter as [horizontal, vertical] in px. */
  gutter: () => [number, number]
}

export const rowContextKey: InjectionKey<RowContext> = Symbol('bili-row')

export function useRowGutter(rowProps: {
  gutter: number | [number, number]
  justify: RowJustify
  align: RowAlign
  wrap: boolean
}) {
  const ns = useNamespace('row')

  const gutters = computed<[number, number]>(() =>
    Array.isArray(rowProps.gutter)
      ? [rowProps.gutter[0] ?? 0, rowProps.gutter[1] ?? 0]
      : [rowProps.gutter, 0]
  )

  const rowStyle = computed<CSSProperties>(() => {
    const [horizontal, vertical] = gutters.value
    return {
      marginLeft: horizontal ? `${-horizontal / 2}px` : undefined,
      marginRight: horizontal ? `${-horizontal / 2}px` : undefined,
      rowGap: vertical ? `${vertical}px` : undefined
    }
  })

  provide(rowContextKey, { gutter: () => gutters.value })

  return { ns, gutters, rowStyle }
}
