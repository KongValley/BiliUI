export function getProp<T = any>(obj: Record<string, any> | undefined, path: string): T | undefined {
  if (!obj || !path) return undefined
  return path.split('.').reduce<any>((acc, key) => (acc == null ? acc : acc[key]), obj)
}

export function setProp(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.')
  const last = keys.pop() as string
  const target = keys.reduce<Record<string, any>>((acc, key) => {
    if (acc[key] == null) acc[key] = {}
    return acc[key]
  }, obj)
  target[last] = value
}

export function cloneDeep<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(item => cloneDeep(item)) as unknown as T
  if (value instanceof Date) return new Date(value.getTime()) as unknown as T
  const result: Record<string, any> = {}
  for (const key of Object.keys(value as Record<string, any>)) {
    result[key] = cloneDeep((value as Record<string, any>)[key])
  }
  return result as T
}
