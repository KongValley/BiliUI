export type ComponentSize = 'sm' | 'md' | 'lg'

export type ComponentType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export type SFCWithInstall<T> = T & {
  install: (app: import('vue').App) => void
}
