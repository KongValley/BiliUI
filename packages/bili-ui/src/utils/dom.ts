import { isNumber, isString } from './is'

export const addUnit = (value?: string | number, defaultUnit = 'px'): string => {
  if (isNumber(value)) return `${value}${defaultUnit}`
  if (isString(value)) return value
  return ''
}

export const getScrollBarWidth = (): number => {
  if (typeof window === 'undefined') return 0
  return window.innerWidth - document.documentElement.clientWidth
}

export const focusElement = (el?: HTMLElement | null): void => {
  el?.focus?.()
}
