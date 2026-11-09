import type { App, Component, Plugin } from 'vue'

export type ComponentWithInstall<T extends Component> = T & Plugin

export const withInstall = <T extends Component>(component: T): ComponentWithInstall<T> => {
  const target = component as ComponentWithInstall<T>
  target.install = (app: App) => {
    const name = (component as any).name || (component as any).__name
    if (name) app.component(name, component as any)
  }
  return target
}

export const withInstallFunction = <T extends (...args: any[]) => any>(fn: T, name: string): T & Plugin => {
  const target = fn as T & Plugin
  target.install = (app: App) => {
    app.config.globalProperties[name] = fn
  }
  return target
}
