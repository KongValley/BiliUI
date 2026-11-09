import { createVNode, render, type Directive, type VNode } from 'vue'
import LoadingOverlay from './loading-overlay.vue'
import type { LoadingBinding, LoadingOptions } from './loading'

interface LoadingInstance {
  container: HTMLElement
  vnode: VNode
  changedPosition: boolean
  originalPosition: string
}

const instances = new WeakMap<HTMLElement, LoadingInstance>()

const normalize = (value: LoadingBinding | undefined): LoadingOptions | null => {
  if (value === undefined || value === null || value === false) return null
  if (value === true) return {}
  return value
}

const renderOverlay = (options: LoadingOptions, show: boolean, onClosed: () => void) =>
  createVNode(LoadingOverlay, { ...options, show, onClosed })

const createLoading = (el: HTMLElement, options: LoadingOptions) => {
  if (instances.has(el)) return

  const position = getComputedStyle(el).position
  const changedPosition = position === 'static'
  const originalPosition = el.style.position
  if (changedPosition) {
    el.style.position = 'relative'
  }

  const container = document.createElement('div')
  container.className = 'bili-loading-wrapper'

  const vnode = renderOverlay(options, true, () => container.remove())
  render(vnode, container)
  el.appendChild(container)

  instances.set(el, { container, vnode, changedPosition, originalPosition })
}

const updateLoading = (el: HTMLElement, options: LoadingOptions) => {
  const instance = instances.get(el)
  if (!instance) return
  instance.vnode = renderOverlay(options, true, () => instance.container.remove())
  render(instance.vnode, instance.container)
}

const removeLoading = (el: HTMLElement) => {
  const instance = instances.get(el)
  if (!instance) return

  // Keep the container mounted until the leave transition finishes.
  const vnode = renderOverlay({}, false, () => instance.container.remove())
  render(vnode, instance.container)

  if (instance.changedPosition) {
    el.style.position = instance.originalPosition
  }
  instances.delete(el)
}

export const vLoading: Directive<HTMLElement, LoadingBinding> = {
  mounted(el, binding) {
    const options = normalize(binding.value)
    if (options) createLoading(el, options)
  },
  updated(el, binding) {
    const options = normalize(binding.value)
    const previous = normalize(binding.oldValue as LoadingBinding | undefined)

    if (!options) {
      removeLoading(el)
      return
    }

    if (!previous) {
      createLoading(el, options)
      return
    }

    if (options.text !== previous.text || options.size !== previous.size) {
      updateLoading(el, options)
    }
  },
  unmounted(el) {
    removeLoading(el)
  }
}
