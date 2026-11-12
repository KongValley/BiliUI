import type { BiliConfig } from '../hooks/use-config'

/**
 * Context passed to imperative services. App-scoped APIs fill in the current
 * ConfigProvider settings and an owner symbol so `closeAll` stays scoped.
 */
export interface ServiceContext {
  config?: BiliConfig
  owner?: symbol
}
