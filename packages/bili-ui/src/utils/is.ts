export const isString = (value: unknown): value is string => typeof value === 'string'

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value)

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

export const isFunction = (value: unknown): value is (...args: any[]) => any =>
  typeof value === 'function'

export const isObject = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === 'object'

export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined

export const isEmpty = (value: unknown): boolean => {
  if (isNil(value) || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  return false
}

export const isClient = typeof window !== 'undefined'
