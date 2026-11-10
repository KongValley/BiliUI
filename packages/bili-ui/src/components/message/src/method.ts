import { createVNode, render, type VNode } from 'vue'
import { getGlobalNamespace } from '../../../hooks/use-namespace'
import { getGlobalLocale } from '../../../hooks/use-config'
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
}

const instances: InternalInstance[] = []
const containers = new Map<MessagePosition, HTMLElement>()
let seed = 0

const getContainer = (position: MessagePosition): HTMLElement => {
  const existing = containers.get(position)
  // A cached node can be detached if the host cleared body; recreate in that case.
  if (existing && existing.isConnected) return existing

  const container = document.createElement('div')
  const namespace = getGlobalNamespace()
  container.className = `${namespace}-message-container ${namespace}-message-container--${position}`
  // Screen readers announce new alerts in a live region.
  container.setAttribute('role', 'region')
  container.setAttribute('aria-label', getGlobalLocale().message)
  document.body.appendChild(container)
  containers.set(position, container)
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
  const container = containers.get(instance.position)
  if (container && container.childElementCount === 0) {
    container.remove()
    containers.delete(instance.position)
  }
}

const createMessage = (params: MessageParams, type?: MessageType): MessageInstance => {
  if (typeof document === 'undefined') {
    return { close: () => undefined }
  }

  const options: MessageOptions = typeof params === 'string' ? { message: params } : { ...params }
  const position = options.position ?? 'top'
  const id = seed++
  const wrapper = document.createElement('div')
  wrapper.className = `${getGlobalNamespace()}-message-wrapper`

  const vnode: VNode = createVNode(MessageComponent, {
    message: options.message,
    type: options.type ?? type ?? 'info',
    duration: options.duration ?? 3000,
    showClose: options.showClose ?? false,
    showProgress: options.showProgress ?? true,
    pauseOnHover: options.pauseOnHover ?? true,
    position,
    namespace: getGlobalNamespace(),
    onClose: () => options.onClose?.(),
    onDestroy: () => destroy(id)
  })

  render(vnode, wrapper)
  getContainer(position).appendChild(wrapper)

  const instance: InternalInstance = {
    id,
    wrapper,
    position,
    close: () => (vnode.component?.exposed as { close?: () => void } | undefined)?.close?.()
  }
  instances.push(instance)
  return instance
}

export interface MessageApi {
  (options: MessageParams): MessageInstance
  success: (options: MessageParams) => MessageInstance
  warning: (options: MessageParams) => MessageInstance
  error: (options: MessageParams) => MessageInstance
  info: (options: MessageParams) => MessageInstance
  closeAll: (position?: MessagePosition) => void
}

export const BiliMessage = ((options: MessageParams) =>
  createMessage(options)) as MessageApi

BiliMessage.success = options => createMessage(options, 'success')
BiliMessage.warning = options => createMessage(options, 'warning')
BiliMessage.error = options => createMessage(options, 'error')
BiliMessage.info = options => createMessage(options, 'info')
BiliMessage.closeAll = position => {
  ;[...instances]
    .filter(instance => !position || instance.position === position)
    .forEach(instance => instance.close())
}

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
