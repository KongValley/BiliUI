import { createVNode, render, type VNode } from 'vue'
import { getGlobalNamespace } from '../../../hooks/use-namespace'
import { getGlobalLocale, type BiliLocale } from '../../../hooks/use-config'
import type { ServiceContext } from '../../../utils/service'
import ConfigScope from '../../config-provider/src/config-scope.vue'
import MessageComponent from './message.vue'
import type {
  MessageInstance,
  MessageOptions,
  MessageParams,
  MessagePosition,
  MessageType
} from './message'

interface InternalInstance extends MessageInstance {
  id: number
  wrapper: HTMLElement
  position: MessagePosition
  containerKey: string
  owner?: symbol
}

const instances: InternalInstance[] = []
const containers = new Map<string, HTMLElement>()
let seed = 0

const getContainer = (
  namespace: string,
  position: MessagePosition,
  locale: BiliLocale
): HTMLElement => {
  const key = `${namespace}:${position}`
  const existing = containers.get(key)
  // A cached node can be detached if the host cleared body; recreate in that case.
  if (existing && existing.isConnected) return existing

  const container = document.createElement('div')
  container.className = `${namespace}-message-container ${namespace}-message-container--${position}`
  // Screen readers announce new alerts in a live region.
  container.setAttribute('role', 'region')
  container.setAttribute('aria-label', locale.message)
  document.body.appendChild(container)
  containers.set(key, container)
  return container
}

const destroy = (id: number) => {
  const index = instances.findIndex(instance => instance.id === id)
  if (index === -1) return
  const [instance] = instances.splice(index, 1)
  render(null, instance.wrapper)
  instance.wrapper.remove()

  // Drop the container once nothing is left in it. Checking the DOM (rather than
  // the instance list) also covers hosts that clear `body` between renders.
  const container = containers.get(instance.containerKey)
  if (container && container.childElementCount === 0) {
    container.remove()
    containers.delete(instance.containerKey)
  }
}

const createMessage = (
  params: MessageParams,
  type?: MessageType,
  context: ServiceContext = {}
): MessageInstance => {
  if (typeof document === 'undefined') {
    return { close: () => undefined }
  }

  const options: MessageOptions = typeof params === 'string' ? { message: params } : { ...params }
  const position = options.position ?? 'top'
  const namespace = context.config?.namespace ?? getGlobalNamespace()
  const locale = context.config?.locale ?? getGlobalLocale()
  const id = seed++
  const wrapper = document.createElement('div')
  wrapper.className = `${namespace}-message-wrapper`

  let exposed: { close?: () => void } | null = null
  const itemVNode: VNode = createVNode(MessageComponent, {
    message: options.message,
    type: options.type ?? type ?? 'info',
    duration: options.duration ?? 3000,
    showClose: options.showClose ?? false,
    showProgress: options.showProgress ?? true,
    pauseOnHover: options.pauseOnHover ?? true,
    position,
    namespace,
    onVnodeMounted: vnode => {
      exposed = (vnode.component?.exposed as { close?: () => void } | null) ?? null
    },
    onClose: () => options.onClose?.(),
    onDestroy: () => destroy(id)
  })

  // Render inside a config scope so App-scoped calls pick up their provider's
  // locale without mutating the global ConfigProvider fallback.
  const vnode: VNode = context.config
    ? createVNode(ConfigScope, { config: context.config }, { default: () => itemVNode })
    : itemVNode

  render(vnode, wrapper)

  const containerKey = `${namespace}:${position}`
  getContainer(namespace, position, locale).appendChild(wrapper)

  const instance: InternalInstance = {
    id,
    wrapper,
    position,
    containerKey,
    owner: context.owner,
    close: () => exposed?.close?.()
  }
  instances.push(instance)
  return instance
}

const closeAll = (position?: MessagePosition, owner?: symbol) => {
  ;[...instances]
    .filter(
      instance =>
        (!position || instance.position === position) && (!owner || instance.owner === owner)
    )
    .forEach(instance => instance.close())
}

export interface MessageApi {
  (options: MessageParams): MessageInstance
  success: (options: MessageParams) => MessageInstance
  warning: (options: MessageParams) => MessageInstance
  error: (options: MessageParams) => MessageInstance
  info: (options: MessageParams) => MessageInstance
  closeAll: (position?: MessagePosition) => void
}

export interface CreateMessageApiOptions {
  /** Read the current App/ConfigProvider context on every call. */
  getContext?: () => ServiceContext
  /** Default options merged into every message created by this API. */
  defaults?: () => Partial<MessageOptions> | undefined
}

export const createMessageApi = (options: CreateMessageApiOptions = {}): MessageApi => {
  const { getContext = (): ServiceContext => ({}), defaults } = options

  const create = (params: MessageParams, type?: MessageType): MessageInstance => {
    const base: MessageOptions = typeof params === 'string' ? { message: params } : { ...params }
    return createMessage({ ...defaults?.(), ...base }, type, getContext())
  }

  const api = ((params: MessageParams) => create(params)) as MessageApi

  api.success = params => create(params, 'success')
  api.warning = params => create(params, 'warning')
  api.error = params => create(params, 'error')
  api.info = params => create(params, 'info')
  api.closeAll = position => closeAll(position, getContext().owner)
  return api
}

export const BiliMessage = createMessageApi()

declare module 'vue' {
  interface ComponentCustomProperties {
    $message: MessageApi
  }
}

/**
 * Test-only hook: unmounts every message and drops all containers immediately,
 * without waiting for leave transitions. Not part of the public API.
 */
export const __resetMessages = () => {
  ;[...instances].forEach(instance => {
    render(null, instance.wrapper)
    instance.wrapper.remove()
  })
  instances.length = 0
  containers.forEach(container => container.remove())
  containers.clear()
}

export default BiliMessage
