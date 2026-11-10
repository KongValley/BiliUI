import { inject } from 'vue'
import { configContextKey } from './use-config'

const defaultNamespace = 'bili'
let globalNamespace = defaultNamespace

export const setGlobalNamespace = (namespace: string): void => {
  globalNamespace = namespace || defaultNamespace
}

/** Namespace used by imperative APIs (Message / Notification / v-loading). */
export const getGlobalNamespace = (): string => globalNamespace

export interface Namespace {
  namespace: string
  block: string
  b: (suffix?: string) => string
  e: (element: string) => string
  m: (modifier: string) => string
  is: (state: string, value?: boolean) => string
  cssVar: (name: string) => string
  cssVarBlock: (name: string) => string
  /** Vue transition class prefix, e.g. `bili-dialog`. */
  transition: (suffix: string) => string
}

export function useNamespace(block: string, override?: string): Namespace {
  const config = inject(configContextKey, null)
  const namespace = override || config?.value.namespace || defaultNamespace

  const b = (suffix?: string) =>
    suffix ? `${namespace}-${block}-${suffix}` : `${namespace}-${block}`
  const e = (element: string) => `${namespace}-${block}__${element}`
  const m = (modifier: string) => `${namespace}-${block}--${modifier}`
  const is = (state: string, value = false) => (value ? `is-${state}` : '')
  const cssVar = (name: string) => `--${namespace}-${block}-${name}`
  const cssVarBlock = (name: string) => `--${namespace}-${name}`
  const transition = (suffix: string) => `${namespace}-${suffix}`

  return { namespace, block, b, e, m, is, cssVar, cssVarBlock, transition }
}
