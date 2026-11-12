import { createVNode, render, type VNode } from 'vue'
import { getGlobalNamespace } from '../../../hooks/use-namespace'
import { getGlobalLocale, type BiliLocale } from '../../../hooks/use-config'
import type { ServiceContext } from '../../../utils/service'
import ConfigScope from '../../config-provider/src/config-scope.vue'
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
  containerKey: string
  owner?: symbol
}

const instances: InternalInstance[] = []
const containers = new Map<string, HTMLElement>()
let seed = 0
/** Keeps the stack readable on screen; older items close automatically. */
const MAX_VISIBLE = 6

const getContainer = (
  namespace: string,
  position: NotificationPosition,
  locale: BiliLocale
): HTMLElement => {
  const key = `${namespace}:${position}`
  const existing = containers.get(key)
  if (existing && existing.isConnected) return existing

  const container = document.createElement('div')
  container.className = `${namespace}-notification-container ${namespace}-notification-container--${position}`
  container.setAttribute('role', 'region')
  container.setAttribute('aria-label', locale.notification)
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

  const container = containers.get(instance.containerKey)
  if (container && container.childElementCount === 0) {
    container.remove()
    containers.delete(instance.containerKey)
  }
}

const createNotification = (
  options: NotificationOptions,
  context: ServiceContext = {}
): NotificationInstance => {
  if (typeof document === 'undefined') {
    return { close: () => undefined }
  }

  const position = options.position ?? 'top-right'
  const namespace = context.config?.namespace ?? getGlobalNamespace()
  const locale = context.config?.locale ?? getGlobalLocale()
  const id = seed++
  const wrapper = document.createElement('div')
  wrapper.className = `${namespace}-notification-wrapper`

  let exposed: { close?: () => void } | null = null
  const itemVNode: VNode = createVNode(NotificationComponent, {
    title: options.title ?? '',
    message: options.message,
    type: options.type ?? 'info',
    duration: options.duration ?? 4500,
    showClose: options.showClose ?? true,
    showProgress: options.showProgress ?? true,
    namespace,
    onVnodeMounted: vnode => {
      exposed = (vnode.component?.exposed as { close?: () => void } | null) ?? null
    },
    onClose: () => options.onClose?.(),
    onDestroy: () => destroy(id)
  })

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

  // Trim the oldest entries in the same corner so the stack never grows forever.
  const sameCorner = instances.filter(item => item.position === position)
  if (sameCorner.length > MAX_VISIBLE) {
    sameCorner.slice(0, sameCorner.length - MAX_VISIBLE).forEach(item => item.close())
  }

  return instance
}

const closeAll = (position?: NotificationPosition, owner?: symbol) => {
  ;[...instances]
    .filter(
      instance =>
        (!position || instance.position === position) && (!owner || instance.owner === owner)
    )
    .forEach(instance => instance.close())
}

export interface NotificationApi {
  (options: NotificationOptions): NotificationInstance
  success: (options: NotificationOptions) => NotificationInstance
  warning: (options: NotificationOptions) => NotificationInstance
  error: (options: NotificationOptions) => NotificationInstance
  info: (options: NotificationOptions) => NotificationInstance
  closeAll: (position?: NotificationPosition) => void
}

export interface CreateNotificationApiOptions {
  getContext?: () => ServiceContext
  defaults?: () => Partial<NotificationOptions> | undefined
}

export const createNotificationApi = (
  options: CreateNotificationApiOptions = {}
): NotificationApi => {
  const { getContext = (): ServiceContext => ({}), defaults } = options

  const create = (params: NotificationOptions, type?: NotificationType): NotificationInstance => {
    const merged = { ...defaults?.(), ...params }
    return createNotification({ ...merged, type: type ?? merged.type }, getContext())
  }

  const api = ((params: NotificationOptions) => create(params)) as NotificationApi

  api.success = params => create(params, 'success')
  api.warning = params => create(params, 'warning')
  api.error = params => create(params, 'error')
  api.info = params => create(params, 'info')
  api.closeAll = position => closeAll(position, getContext().owner)
  return api
}

export const BiliNotification = createNotificationApi()

/** Test helper: unmount everything and reset the container cache. */
export const __resetNotifications = (): void => {
  ;[...instances].forEach(instance => destroy(instance.id))
  containers.forEach(container => container.remove())
  containers.clear()
  seed = 0
}

export type { NotificationType }
