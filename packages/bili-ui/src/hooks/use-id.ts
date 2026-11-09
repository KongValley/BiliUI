let idSeed = 0

export function useId(prefix = 'bili-id'): string {
  idSeed += 1
  return `${prefix}-${idSeed}`
}
