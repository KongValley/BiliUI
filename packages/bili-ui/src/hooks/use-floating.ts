import {
  autoUpdate,
  arrow,
  computePosition,
  flip,
  offset,
  shift,
  type Middleware,
  type Placement
} from '@floating-ui/dom'
import {
  computed,
  onBeforeUnmount,
  ref,
  unref,
  watch,
  type CSSProperties,
  type Ref
} from 'vue'

export interface UseFloatingOptions {
  placement?: Placement | Ref<Placement>
  strategy?: 'absolute' | 'fixed'
  offset?: number
  arrowEl?: Ref<HTMLElement | null>
  padding?: number
}

export function useFloating(
  reference: Ref<HTMLElement | null>,
  floating: Ref<HTMLElement | null>,
  options: UseFloatingOptions = {}
) {
  const x = ref(0)
  const y = ref(0)
  const strategy = ref<'absolute' | 'fixed'>(options.strategy ?? 'absolute')
  const placement = ref<Placement>((unref(options.placement) as Placement) ?? 'bottom-start')
  const middlewareData = ref<Record<string, any>>({})
  const isPositioned = ref(false)

  let cleanup: (() => void) | null = null

  const update = async (): Promise<void> => {
    const referenceEl = reference.value
    const floatingEl = floating.value
    if (!referenceEl || !floatingEl) return

    const middleware: Middleware[] = [
      offset(options.offset ?? 8),
      flip({ padding: options.padding ?? 8 }),
      shift({ padding: options.padding ?? 8 })
    ]

    if (options.arrowEl?.value) {
      middleware.push(arrow({ element: options.arrowEl.value, padding: 4 }))
    }

    const result = await computePosition(referenceEl, floatingEl, {
      placement: placement.value,
      strategy: strategy.value,
      middleware
    })

    x.value = result.x
    y.value = result.y
    placement.value = result.placement
    middlewareData.value = (result.middlewareData ?? {}) as Record<string, any>
    isPositioned.value = true
  }

  watch(
    [reference, floating],
    ([referenceEl, floatingEl]) => {
      cleanup?.()
      cleanup = null
      isPositioned.value = false
      if (referenceEl && floatingEl) {
        cleanup = autoUpdate(referenceEl, floatingEl, update)
      }
    },
    { flush: 'post', immediate: true }
  )

  watch(
    () => unref(options.placement),
    value => {
      if (value) {
        placement.value = value
        if (reference.value && floating.value) void update()
      }
    }
  )

  watch(
    () => options.arrowEl?.value,
    () => {
      if (reference.value && floating.value) void update()
    }
  )

  onBeforeUnmount(() => {
    cleanup?.()
    cleanup = null
  })

  const floatingStyles = computed<CSSProperties>(() => ({
    position: strategy.value,
    left: `${x.value}px`,
    top: `${y.value}px`
  }))

  const arrowStyles = computed<CSSProperties>(() => {
    const data = middlewareData.value.arrow
    if (!data) return {}
    return {
      left: typeof data.x === 'number' ? `${data.x}px` : '',
      top: typeof data.y === 'number' ? `${data.y}px` : ''
    }
  })

  return {
    x,
    y,
    placement,
    strategy,
    middlewareData,
    isPositioned,
    floatingStyles,
    arrowStyles,
    update
  }
}
