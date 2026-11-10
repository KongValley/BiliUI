import { createVNode, render, type VNode } from 'vue'
import { getGlobalNamespace } from '../../../hooks/use-namespace'
import { getGlobalLocale } from '../../../hooks/use-config'
import NotificationComponent from './notification.vue'
import type {
  NotificationOptions,
  NotificationPosition,
  NotificationType
} from './notification'

export interface NotificationInstance {
  close: () => void
}

interface InternalInstance extends NotificationInstance {
  id: number
  wrapper: HTMLElement
  position: NotificationPosition
}

const instances: InternalInstance[] = []
const containers = new Map<NotificationPosition, HTMLElement>()
let seed = 0
/** Keeps the stack readable on screen; older items close automatically. */
const MAX_VISIBLE = 6

const getContainer = (position: NotificationPosition): HTMLElement => {
  const existing = containers.get(position)
  if (existing && existing.isConnected) return existing

  const container = document.createElement('div')
  const namespace = getGlobalNamespace()
  container.className = `${namespace}-notification-container ${namespace}-notification-container--${position}`
  container.setAttribute('role', 'region')
  container.setAttribute('aria-label', getGlobalLocale().notification)
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

  const container = containers.get(instance.position)
  if (container && container.childElementCount === 0) {
    container.remove()
    containers.delete(instance.position)
  }
}

const createNotification = (options: NotificationOptions): NotificationInstance => {
  if (typeof document === 'undefined') {
    return { close: () => undefined }
  }

  const position = options.position ?? 'top-right'
  const id = seed++
  const wrapper = document.createElement('div')
  wrapper.className = `${getGlobalNamespace()}-notification-wrapper`

  const vnode: VNode = createVNode(NotificationComponent, {
    title: options.title ?? '',
    message: options.message,
    type: options.type ?? 'info',
    duration: options.duration ?? 4500,
    showClose: options.showClose ?? true,
    showProgress: options.showProgress ?? true,
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

  // Trim the oldest entries in the same corner so the stack never grows forever.
  const sameCorner = instances.filter(item => item.position === position)
  if (sameCorner.length > MAX_VISIBLE) {
    sameCorner.slice(0, sameCorner.length - MAX_VISIBLE).forEach(item => item.close())
  }

  return instance
}

export interface NotificationApi {
  (options: NotificationOptions): NotificationInstance
  success: (options: NotificationOptions) => NotificationInstance
  warning: (options: NotificationOptions) => NotificationInstance
  error: (options: NotificationOptions) => NotificationInstance
  info: (options: NotificationOptions) => NotificationInstance
  closeAll: (position?: NotificationPosition) => void
}

export const BiliNotification = ((options: NotificationOptions) =>
  createNotification(options)) as NotificationApi

BiliNotification.success = options => createNotification({ ...options, type: 'success' })
BiliNotification.warning = options => createNotification({ ...options, type: 'warning' })
BiliNotification.error = options => createNotification({ ...options, type: 'error' })
BiliNotification.info = options => createNotification({ ...options, type: 'info' })
BiliNotification.closeAll = position => {
  ;[...instances]
    .filter(instance => !position || instance.position === position)
    .forEach(instance => instance.close())
}

/** Test helper: unmount everything and reset the container cache. */
export const __resetNotifications = (): void => {
  ;[...instances].forEach(instance => destroy(instance.id))
  containers.forEach(container => container.remove())
  containers.clear()
  seed = 0
}

export type { NotificationType }
