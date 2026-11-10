import { inject, ref, type Ref } from 'vue'
import { configContextKey, defaultConfig } from './use-config'

let globalZIndex = defaultConfig.zIndex

export function useZIndex(): {
  currentZIndex: Ref<number>
  nextZIndex: () => number
} {
  const config = inject(configContextKey, null)
  const currentZIndex = ref(config?.value.zIndex ?? globalZIndex)

  const nextZIndex = () => {
    // ConfigProvider can raise the floor so app dialogs sit above host UI.
    globalZIndex = Math.max(globalZIndex, config?.value.zIndex ?? defaultConfig.zIndex) + 1
    currentZIndex.value = globalZIndex
    return globalZIndex
  }

  return { currentZIndex, nextZIndex }
}
