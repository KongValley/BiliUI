const defaultNamespace = 'bili'

export interface Namespace {
  namespace: string
  block: string
  b: (suffix?: string) => string
  e: (element: string) => string
  m: (modifier: string) => string
  is: (state: string, value?: boolean) => string
  cssVar: (name: string) => string
  cssVarBlock: (name: string) => string
}

export function useNamespace(block: string): Namespace {
  const namespace = defaultNamespace

  const b = (suffix?: string) =>
    suffix ? `${namespace}-${block}-${suffix}` : `${namespace}-${block}`
  const e = (element: string) => `${namespace}-${block}__${element}`
  const m = (modifier: string) => `${namespace}-${block}--${modifier}`
  const is = (state: string, value = false) => (value ? `is-${state}` : '')
  const cssVar = (name: string) => `--${namespace}-${block}-${name}`
  const cssVarBlock = (name: string) => `--${namespace}-${name}`

  return { namespace, block, b, e, m, is, cssVar, cssVarBlock }
}
