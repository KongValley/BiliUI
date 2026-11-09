export function debugWarn(scope: string, message: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[bili-ui] ${scope}: ${message}`)
  }
}
