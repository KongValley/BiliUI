import { createVNode, render, type VNode } from 'vue'
import { getGlobalNamespace } from '../../../hooks/use-namespace'
import { getGlobalLocale } from '../../../hooks/use-config'
import type { ServiceContext } from '../../../utils/service'
import ConfigScope from '../../config-provider/src/config-scope.vue'
import MessageBoxComponent from './message-box.vue'
import type {
  MessageBoxAction,
  MessageBoxOptions,
  MessageBoxResult,
  MessageBoxType
} from './message-box'

export type MessageBoxPromise = Promise<MessageBoxResult> & { close: () => void }

interface InternalInstance {
  close: () => void
  wrapper: HTMLElement
  owner?: symbol
}

const instances: InternalInstance[] = []

const destroy = (wrapper: HTMLElement) => {
  render(null, wrapper)
  wrapper.remove()
}

const createMessageBox = (
  params: string | MessageBoxOptions,
  type: MessageBoxType,
  defaults: Partial<MessageBoxOptions> = {},
  context: ServiceContext = {}
): MessageBoxPromise => {
  if (typeof document === 'undefined') {
    return Object.assign(Promise.resolve({ action: 'close' as const, value: '' }), {
      close: () => undefined
    })
  }

  const locale = context.config?.locale ?? getGlobalLocale()
  const namespace = context.config?.namespace ?? getGlobalNamespace()
  const options: MessageBoxOptions =
    typeof params === 'string' ? { message: params } : { ...params }

  const wrapper = document.createElement('div')
  wrapper.className = `${namespace}-message-box-wrapper`
  document.body.appendChild(wrapper)

  let instance: InternalInstance | null = null
  let settled = false

  const promise = new Promise<MessageBoxResult>((resolve, reject) => {
    let exposed: { close?: () => void } | null = null
    const itemVNode: VNode = createVNode(MessageBoxComponent, {
      modelValue: true,
      title: options.title ?? defaults.title ?? '',
      message: options.message ?? '',
      type: options.type ?? type,
      confirmText: options.confirmButtonText ?? locale.confirm,
      cancelText: options.cancelButtonText ?? locale.cancel,
      showCancelButton: options.showCancelButton ?? defaults.showCancelButton ?? false,
      showClose: options.showClose ?? defaults.showClose ?? true,
      closeOnClickModal: options.closeOnClickModal ?? true,
      closeOnPressEscape: options.closeOnPressEscape ?? true,
      input: options.input ?? defaults.input ?? false,
      inputValue: options.inputValue ?? '',
      inputPlaceholder: options.inputPlaceholder ?? '',
      inputPattern: options.inputPattern,
      inputValidator: options.inputValidator,
      beforeClose: options.beforeClose,
      distinguishCancelAndClose: options.distinguishCancelAndClose,
      overlayClass: options.overlayClass ?? '',
      panelClass: options.panelClass ?? '',
      zIndex: options.zIndex,
      onVnodeMounted: vnode => {
        exposed = (vnode.component?.exposed as { close?: () => void } | null) ?? null
      },
      onAction: (action: MessageBoxAction, value: string) => {
        if (settled) return
        settled = true
        if (action === 'confirm') resolve({ action, value })
        else reject(action)
      },
      onClosed: () => {
        if (!settled) {
          settled = true
          reject('close')
        }
        destroy(wrapper)
        const index = instances.indexOf(internal)
        if (index > -1) instances.splice(index, 1)
      }
    })

    const vnode: VNode = context.config
      ? createVNode(ConfigScope, { config: context.config }, { default: () => itemVNode })
      : itemVNode

    const internal: InternalInstance = {
      wrapper,
      owner: context.owner,
      close: () => exposed?.close?.()
    }
    instance = internal

    render(vnode, wrapper)
    instances.push(internal)
  })

  return Object.assign(promise, {
    close: () => instance?.close()
  })
}

const merge = (
  message: string | MessageBoxOptions,
  title?: string,
  options?: MessageBoxOptions
): MessageBoxOptions => {
  if (typeof message === 'string') {
    return { ...options, message, title: title ?? options?.title ?? '' }
  }
  return { ...message, title: title ?? message.title }
}

const closeAll = (owner?: symbol) => {
  ;[...instances]
    .filter(instance => !owner || instance.owner === owner)
    .forEach(instance => instance.close())
}

export interface MessageBoxApi {
  alert: (
    message: string | MessageBoxOptions,
    title?: string,
    options?: MessageBoxOptions
  ) => MessageBoxPromise
  confirm: (
    message: string | MessageBoxOptions,
    title?: string,
    options?: MessageBoxOptions
  ) => MessageBoxPromise
  prompt: (
    message: string | MessageBoxOptions,
    title?: string,
    options?: MessageBoxOptions
  ) => MessageBoxPromise
  closeAll: () => void
}

export interface CreateMessageBoxApiOptions {
  getContext?: () => ServiceContext
  defaults?: () => Partial<MessageBoxOptions> | undefined
}

export const createMessageBoxApi = (options: CreateMessageBoxApiOptions = {}): MessageBoxApi => {
  const { getContext = (): ServiceContext => ({}), defaults } = options
  const base = () => defaults?.() ?? {}

  const create = (
    params: string | MessageBoxOptions,
    type: MessageBoxType,
    methodDefaults: Partial<MessageBoxOptions>
  ) => createMessageBox(params, type, { ...base(), ...methodDefaults }, getContext())

  return {
    alert: (message, title, options) =>
      create(merge(message, title, options), 'info', {
        showCancelButton: false
      }),
    confirm: (message, title, options) =>
      create(merge(message, title, options), 'warning', {
        showCancelButton: true
      }),
    prompt: (message, title, options) =>
      create(merge(message, title, options), 'info', {
        showCancelButton: true,
        input: true
      }),
    closeAll: () => closeAll(getContext().owner)
  }
}

export const BiliMessageBox = createMessageBoxApi()

declare module 'vue' {
  interface ComponentCustomProperties {
    $msgbox: MessageBoxApi
    $alert: MessageBoxApi['alert']
    $confirm: MessageBoxApi['confirm']
    $prompt: MessageBoxApi['prompt']
  }
}

/** Test-only hook that unmounts every dialog immediately. */
export const __resetMessageBoxes = () => {
  ;[...instances].forEach(instance => destroy(instance.wrapper))
  instances.length = 0
}

export default BiliMessageBox
