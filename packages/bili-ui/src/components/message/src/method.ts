import { createVNode, render, type VNode } from 'vue'
import MessageComponent from './message.vue'
import type {
  MessageInstance,
  MessageOptions,
  MessageParams,
  MessageType
} from './message'

interface InternalInstance extends MessageInstance {
  id: number
  wrapper: HTMLElement
}

const instances: InternalInstance[] = []
let seed = 0
let container: HTMLElement | null = null

const getContainer = (): HTMLElement => {
  if (!container) {
    container = document.createElement('div')
    container.className = 'bili-message-container'
    document.body.appendChild(container)
  }
  return container
}

const destroy = (id: number) => {
  const index = instances.findIndex(instance => instance.id === id)
  if (index === -1) return
  const [instance] = instances.splice(index, 1)
  render(null, instance.wrapper)
  instance.wrapper.remove()
}

const createMessage = (params: MessageParams, type?: MessageType): MessageInstance => {
  if (typeof document === 'undefined') {
    return { close: () => undefined }
  }

  const options: MessageOptions = typeof params === 'string' ? { message: params } : { ...params }
  const id = seed++
  const wrapper = document.createElement('div')
  wrapper.className = 'bili-message-wrapper'

  const vnode: VNode = createVNode(MessageComponent, {
    message: options.message,
    type: options.type ?? type ?? 'info',
    duration: options.duration ?? 3000,
    showClose: options.showClose ?? false,
    showProgress: options.showProgress ?? true,
    pauseOnHover: options.pauseOnHover ?? true,
    onClose: () => options.onClose?.(),
    onDestroy: () => destroy(id)
  })

  render(vnode, wrapper)
  getContainer().appendChild(wrapper)

  const instance: InternalInstance = {
    id,
    wrapper,
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
  closeAll: () => void
}

export const BiliMessage = ((options: MessageParams) =>
  createMessage(options)) as MessageApi

BiliMessage.success = options => createMessage(options, 'success')
BiliMessage.warning = options => createMessage(options, 'warning')
BiliMessage.error = options => createMessage(options, 'error')
BiliMessage.info = options => createMessage(options, 'info')
BiliMessage.closeAll = () => {
  ;[...instances].forEach(instance => instance.close())
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $message: MessageApi
  }
}

export default BiliMessage
