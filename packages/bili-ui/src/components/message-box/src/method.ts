import { createVNode, render, type VNode } from 'vue'
import { getGlobalLocale } from '../../../hooks/use-config'
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
}

const instances: InternalInstance[] = []

const destroy = (wrapper: HTMLElement) => {
  render(null, wrapper)
  wrapper.remove()
}

const createMessageBox = (
  params: string | MessageBoxOptions,
  type: MessageBoxType,
  defaults: Partial<MessageBoxOptions> = {}
): MessageBoxPromise => {
  if (typeof document === 'undefined') {
    return Object.assign(Promise.resolve({ action: 'close' as const, value: '' }), {
      close: () => undefined
    })
  }

  const locale = getGlobalLocale()
  const options: MessageBoxOptions =
    typeof params === 'string' ? { message: params } : { ...params }

  const wrapper = document.createElement('div')
  wrapper.className = 'bili-message-box-wrapper'
  document.body.appendChild(wrapper)

  let instance: InternalInstance | null = null
  let settled = false

  const promise = new Promise<MessageBoxResult>((resolve, reject) => {
    const vnode: VNode = createVNode(MessageBoxComponent, {
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

    const internal: InternalInstance = {
      close: () => (vnode.component?.exposed as { close?: () => void } | undefined)?.close?.()
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

export const BiliMessageBox = {
  alert: (message, title, options) =>
    createMessageBox(merge(message, title, options), 'info', {
      showCancelButton: false
    }),
  confirm: (message, title, options) =>
    createMessageBox(merge(message, title, options), 'warning', {
      showCancelButton: true
    }),
  prompt: (message, title, options) =>
    createMessageBox(merge(message, title, options), 'info', {
      showCancelButton: true,
      input: true
    }),
  closeAll: () => {
    ;[...instances].forEach(instance => instance.close())
  }
} as MessageBoxApi

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
  instances.length = 0
  if (typeof document === 'undefined') return
  document.querySelectorAll('.bili-message-box-wrapper').forEach(node => node.remove())
}

export default BiliMessageBox
