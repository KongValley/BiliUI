import { createVNode, render, type VNode } from 'vue'
import { getGlobalNamespace } from '../../../hooks/use-namespace'
import type { ComponentSize } from '../../../utils/types'
import LoadingServiceComponent from './loading-service.vue'

export interface LoadingServiceOptions {
  text?: string
  size?: ComponentSize
  /** Element or selector that receives the overlay. Omit for a fullscreen mask. */
  target?: string | HTMLElement
  /** Force fixed fullscreen mode. Defaults to `true` when no target is given. */
  fullscreen?: boolean
  /** Lock body scrolling while a fullscreen mask is open. Defaults to `true`. */
  lock?: boolean
  /** Background of the mask; falls back to the theme default. */
  background?: string
  /** Extra class applied to the mask. */
  customClass?: string
  /** Namespace override used by App-scoped services. */
  namespace?: string
}

export interface LoadingServiceInstance {
  close: () => void
  setText: (text: string) => void
  readonly visible: boolean
}

let lockCount = 0
let savedOverflow = ''
const activeCleanups = new Set<() => void>()

const lockBody = () => {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount += 1
}

const unlockBody = () => {
  if (lockCount === 0) return
  lockCount -= 1
  if (lockCount === 0) document.body.style.overflow = savedOverflow
}

const resolveTarget = (target?: string | HTMLElement): HTMLElement | null => {
  if (!target) return null
  if (typeof target !== 'string') return target

  const el = document.querySelector<HTMLElement>(target)
  if (!el && typeof console !== 'undefined') {
    console.warn(`[BiliLoading] target not found: ${target}`)
  }
  return el
}

/**
 * Imperative full-screen (or targeted) loading mask.
 *
 * ```ts
 * const loading = BiliLoading.service({ text: '加载中' })
 * loading.close()
 * ```
 */
export const loadingService = (options: LoadingServiceOptions = {}): LoadingServiceInstance => {
  if (typeof document === 'undefined') {
    return {
      close: () => undefined,
      setText: () => undefined,
      visible: false
    }
  }

  const namespace = options.namespace ?? getGlobalNamespace()
  const target = resolveTarget(options.target)
  const fullscreen = options.fullscreen ?? !target
  const host = target ?? document.body

  let changedPosition = false
  let originalPosition = ''
  if (!fullscreen && getComputedStyle(host).position === 'static') {
    changedPosition = true
    originalPosition = host.style.position
    host.style.position = 'relative'
  }

  const wrapper = document.createElement('div')
  wrapper.className = `${namespace}-loading-service`
  host.appendChild(wrapper)

  const locked = fullscreen && options.lock !== false
  if (locked) lockBody()

  let visible = true
  let text = options.text ?? ''
  let cleaned = false

  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    render(null, wrapper)
    wrapper.remove()
    if (changedPosition) host.style.position = originalPosition
    if (locked) unlockBody()
    activeCleanups.delete(cleanup)
  }
  activeCleanups.add(cleanup)

  const renderLoading = (show: boolean) => {
    const vnode: VNode = createVNode(LoadingServiceComponent, {
      show,
      text,
      size: options.size ?? 'md',
      fullscreen,
      background: options.background ?? '',
      customClass: options.customClass ?? '',
      namespace,
      onClosed: cleanup
    })
    render(vnode, wrapper)
  }

  renderLoading(true)

  return {
    get visible() {
      return visible
    },
    close() {
      if (!visible) return
      visible = false
      renderLoading(false)
    },
    setText(next: string) {
      text = next
      if (visible) renderLoading(true)
    }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $loading: typeof loadingService
  }
}

/** Test-only hook: tears down every mask and resets the body scroll lock. */
export const __resetLoadingService = () => {
  ;[...activeCleanups].forEach(cleanup => cleanup())
  activeCleanups.clear()
  lockCount = 0
  savedOverflow = ''
  if (typeof document !== 'undefined') document.body.style.overflow = ''
}
